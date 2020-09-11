import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import { logger } from 'kahve-core';
import { RestError } from '../RestError';
import { HttpStatus } from '../HttpStatus';
import { RestAppManager } from './RestAppManager';
import { RequestValidator } from './RequestValidator';
import { Helper } from './Helper';
import {
	Method,
	MethodArgType,
	IQueryParamConfig,
	IPathVariableConfig,
	Controller,
	Server,
	ServerController,
	ServerConfig,
	ServerLifecycleMethod,
	ServerLifecylceMethodType,
	IRequestHeaderConfig
} from '../types/Kahve/Rest';

/**
 * Type definiton of the request handler method
 * @internal
 */
type RequestHandler = (req: express.Request, res: express.Response) => void;

/**
 * Annotation processing implementation of servers defined within global scope which is defined by using annotations.
 * @internal
 */
export class DecoratorProcessor {
	constructor() {}

	/**
	 * Processes the server instance defined in global variable. It registers REST endpoints to the
	 * express app with wrapped request handler.
	 * @param srvname server name
	 * @param expressApp express app instance
	 */
	public static process(srvname: string, expressApp: express.Application): void {
		return new DecoratorProcessor().process(srvname, expressApp);
	}

	/**
	 * Processes the server instance defined in global variable. It registers REST endpoints to the
	 * express app with wrapped request handler.
	 * @param srvname server name
	 * @param expressApp express app instance
	 */
	public process(srvname: string, expressApp: express.Application): void {
		const server = RestAppManager.app().getServer(srvname);
		if (!server) return;
		if (!server.instance) return;
		if (!expressApp) return;

		this.updatePropertyValuesFromInstance(server).registerEndpoints(server, expressApp).startServer(server, expressApp);
	}

	/**
	 * Updates properties' values annotated with property annotations in server definition
	 * @param server server instance
	 */
	private updatePropertyValuesFromInstance(server: Server): this {
		server.getControllers().forEach(controller => {
			const descriptor = Object.getOwnPropertyDescriptor(server.instance, controller.name);
			if (descriptor) server.addController(new ServerController(controller.name, descriptor.value));
			else logger.error(`"${controller.name}" named controller in server definition is not instantiated`);
		});

		server.getConfigs().forEach(config => {
			const descriptor = Object.getOwnPropertyDescriptor(server.instance, config.name);
			if (descriptor) server.addConfig(new ServerConfig(config.key, config.name, descriptor.value));
		});

		return this;
	}

	/**
	 * Registers endpoints to the express app
	 * @param server server instance
	 * @param expressApp express application instance
	 */
	private registerEndpoints(server: Server, expressApp: express.Application): this {
		server.getControllers().forEach(property => {
			if (!property.value) return;

			const controller = RestAppManager.app().getController(Helper.getClassName(property.value));
			if (!controller) return;

			controller.getMethods().forEach(method => {
				const fullPath = Helper.generatePath(controller.baseUrl, method.path);
				const httpMethod = (method.httpMethod || 'NOTFOUND').toLowerCase();
				if (typeof expressApp[httpMethod] === 'function') {
					expressApp[httpMethod](fullPath, this.generateRequestHandler(method, controller));
					this.log(controller.name, httpMethod, fullPath, 'Endpoint is registered');
				}
			});
		});
		return this;
	}

	/**
	 * Starts server with configurations defined with annotations and calls the lifecycle hooks.
	 * @param server server instance
	 * @param expressApp express application instance
	 */
	private async startServer(server: Server, expressApp: express.Application): Promise<this> {
		try {
			const preStartHook = server.getLifecycleMethodByType(ServerLifecylceMethodType.PRESTART);
			await this.callLifecycleMethod(preStartHook, server);
		} catch (e) {
			logger.error(`Error occured while invoking "PRESTART" lifecycle method.`, e.message || e);
			return this;
		}

		try {
			await this.listenServer(this.createServer(expressApp, server), server);
		} catch (e) {
			logger.error(`Error occured while creating server.`, e.message || e);
			return this;
		}

		try {
			const postStartHook = server.getLifecycleMethodByType(ServerLifecylceMethodType.POSTSTART);
			this.callLifecycleMethod(postStartHook, server);
		} catch (e) {
			logger.error(`Error occured while invoking "POSTSTART" lifecycle method.`, e.message || e);
			return this;
		}

		return this;
	}

	/**
	 * Generates the custom request handlers to cover additional features like:
	 * - Logs the request
	 * - Validates the request
	 * - Calls user defined method with the right ordered arguments which are extracted from the request
	 * - Sends the return value of the user defined method as a response
	 * - Handles the async method returns
	 * - Handles the exception thrown from user defined methods and send it as an error response
	 * @param method endpoint method definition which is defined in the controller
	 * @param controllerName controller name
	 */
	private generateRequestHandler(method: Method, controller: Controller): RequestHandler {
		// eslint-disable-next-line @typescript-eslint/space-before-function-paren
		return async (req: express.Request, res: express.Response) => {
			try {
				this.logRequest(req, controller, method);
				this.validateRequest(req, method);
				const response = await this.callHandler(method, controller, req);

				if (response) this.sendResponse(res, response);
				else res.end();
			} catch (error) {
				this.sendError(error, req.path, res);
			}
		};
	}

	/**
	 * Validates the http request with using RequestValidator class.
	 * @throws RestError if validation fails
	 * @param req request instance of express app
	 * @param method method and its arguments definitions
	 */
	private validateRequest(req: express.Request, method: Method): void {
		new RequestValidator(req, method).validate();
	}

	/**
	 * Calls the handler defined in the method if it is a function.
	 * @param method method definition
	 * @param controller controller definition
	 * @param req express request instance
	 */
	private callHandler(method: Method, controller: Controller, req: express.Request): any {
		return typeof method.handler === 'function' && method.handler.apply(controller.instance, this.generateHandlerArgs(method, req));
	}

	/**
	 * Generates the method argument list which is going to be passed to the user defined http request handler.
	 * It parses the http request and fill the argument list in correct order with parsed values.
	 * @param method method and its arguments definitions
	 * @param req request instance of express app
	 */
	private generateHandlerArgs(method: Method, req: express.Request): any[] {
		const queryParams = method.getArgsByType(MethodArgType.QUERY_PARAM);
		const pathVariables = method.getArgsByType(MethodArgType.PATH_VARIABLE);
		const requestHeader = method.getArgsByType(MethodArgType.REQUEST_HEADER);
		const requestBodies = method.getArgsByType(MethodArgType.REQUEST_BODY);
		const requestHeaders = method.getArgsByType(MethodArgType.REQUEST_HEADERS);

		const args: any[] = Array.from(new Array(method.getMaxArgPosition()));
		for (const p of queryParams) args[p.position] = req.query[p.getConfig<IQueryParamConfig>().key];
		for (const v of pathVariables) args[v.position] = req.params[v.getConfig<IPathVariableConfig>().key];
		for (const h of requestHeader) args[h.position] = req.header(h.getConfig<IRequestHeaderConfig>().key);
		for (const b of requestBodies) args[b.position] = req.body;
		for (const hs of requestHeaders) args[hs.position] = req.rawHeaders;

		return args;
	}

	/**
	 * Calls the handler defined in the lifecycle method if it is a function.
	 * @param method lifecycle method definition
	 * @param server server definition
	 */
	private callLifecycleMethod(method: ServerLifecycleMethod, server: Server): any {
		if (method && method instanceof ServerLifecycleMethod && typeof method.handler === 'function') {
			return method.handler.apply(server.instance);
		}
	}

	/**
	 * Creates the server with configurations defined with annotations
	 * @throws error if error occured while openning https related config files
	 * @param expressApp express application instance
	 * @param server server instance
	 */
	private createServer(expressApp: express.Application, server: Server): http.Server {
		const isSecureServer = server.getConfigByKey('SECURE').value;
		const certFile = server.getConfigByKey('CERT').value;
		const keyFile = server.getConfigByKey('KEY').value;

		if (isSecureServer && certFile && certFile) {
			const cert = fs.readFileSync(path.resolve(certFile), 'utf8');
			const key = fs.readFileSync(path.resolve(keyFile), 'utf8');
			return https.createServer({ key, cert }, expressApp);
		} else {
			return http.createServer(expressApp);
		}
	}

	/**
	 * Starts listening the server with configurations defined with annotations
	 * @throws error if error occured while openning https related config files
	 * @param httpServer http server instance
	 * @param server server instance
	 */
	private async listenServer(httpServer: http.Server, server: Server): Promise<void> {
		const host = `${server.getConfigByKey('HOST').value}`;
		const port = +server.getConfigByKey('PORT').value;

		return new Promise(resolve => httpServer.listen(port, host, resolve));
	}

	/**
	 * Sends the response to the client with 200 OK response code.
	 * @param res response instance of express app
	 * @param response response to be sent
	 */
	private sendResponse(res: express.Response, response: any): void {
		res.status(HttpStatus.OK).send(response);
	}

	/**
	 * Sends the response to the client with defined error.
	 * @param error error instance
	 * @param requestPath request path
	 * @param res response instance of express app
	 */
	private sendError(error: any, requestPath: string, res: express.Response): void {
		const restError = this.getAsRestError(error, requestPath);
		res.status(restError.code).send(restError.toErrorResponse());
	}

	/**
	 * Converts everything to the RestError type.
	 * @param error error instance
	 * @param requestPath request path
	 */
	private getAsRestError(error: any, requestPath: string): RestError {
		if (error instanceof RestError) return error.setPath(requestPath);
		if (error instanceof Error) return new RestError(error.message).setPath(requestPath);
		return new RestError('Internal server error occured').setPath(requestPath);
	}

	/**
	 * Logs the request.
	 * @param req request instance of express app
	 * @param cname controller name
	 * @param method method definition
	 */
	private logRequest(req: express.Request, controller: Controller, method: Method): void {
		const logDetails = [];
		if (Object.keys(req.params).length) logDetails.push('Path variables', JSON.stringify(req.params));
		if (Object.keys(req.query).length) logDetails.push('Query params:', JSON.stringify(req.query));
		if (Object.keys(req.headers).length) logDetails.push('Header:', JSON.stringify(req.headers));
		if (Object.keys(req.body).length) logDetails.push('Body:', JSON.stringify(req.body));

		this.log(controller.name, method.httpMethod, req.path, 'Request is received.', ...logDetails);
	}

	/**
	 * Prints log.
	 * @param cname controller name
	 * @param mname method name
	 * @param requestPath request path
	 * @param messages messages to be printed
	 */
	private log(cname: string, mname: string, requestPath: string, ...messages: any[]): void {
		logger.verbose(`[${cname}] [${mname.toUpperCase()} ${requestPath}]`, messages.join(' '));
	}
}
