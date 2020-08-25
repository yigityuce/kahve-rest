import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { logger } from 'kahve-core';
import { RestError } from '../RestError';
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
	ServerLifecylceMethodType
} from '../types/Kahve/Rest';

/**
 * Annotation processing implementation of servers defined within global scope which is defined by using annotations.
 *
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
		const app = RestAppManager.app();
		const server = app.getServer(srvname);
		if (!server) return;
		if (!server.instance) return;
		if (!expressApp) return;

		this.updatePropertyValuesFromInstance(server);
		server.getControllers().forEach(property => {
			if (!property.value) return;

			const controller = app.getController(Helper.getClassName(property.value));
			if (!controller) return;

			controller.getMethods().forEach(method => {
				const path = this.generatePath(controller.baseUrl, method.path);
				const httpMethod = (method.httpMethod || 'UNDEFINED').toLowerCase();
				if (typeof expressApp[httpMethod] === 'function') {
					expressApp[httpMethod](path, this.generateRequestHandler(method, controller));
					this.log(controller.name, httpMethod, path, 'Endpoint is registered');
				}
			});
		});

		this.callLifecycleMethod(server.getLifecycleMethodByType(ServerLifecylceMethodType.PRESTART), server).finally(() => {
			expressApp.listen(Number.parseInt(server.getConfigByKey('PORT').value, 10), () => {
				this.callLifecycleMethod(server.getLifecycleMethodByType(ServerLifecylceMethodType.POSTSTART), server).catch(() => {});
			});
		});
	}

	/**
	 * Updates properties' values annotated with property annotations in server definition
	 * @param server server instance
	 */
	private updatePropertyValuesFromInstance(server: Server): void {
		server.getControllers().forEach(controller => {
			const descriptor = Object.getOwnPropertyDescriptor(server.instance, controller.name);
			if (!descriptor) {
				logger.error(`"${controller.name}" named controller in server definition is not instantiated`);
			} else {
				server.addController(new ServerController(controller.name, descriptor.value));
			}
		});

		server.getConfigs().forEach(config => {
			const descriptor = Object.getOwnPropertyDescriptor(server.instance, config.name);
			if (descriptor) server.addConfig(new ServerConfig(config.key, config.name, descriptor.value));
		});
	}

	/**
	 * Concats the pieces to generate full endpoint path.
	 * @param pieces
	 */
	private generatePath(...pieces: string[]): string {
		return `/${[...pieces.filter(p => p)]
			.join('/')
			.split('/')
			.filter(p => p)
			.join('/')}`;
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
	private generateRequestHandler(method: Method, controller: Controller): Function {
		return (req: express.Request, res: express.Response) => {
			try {
				this.logRequest(req, controller, method);
				this.validateRequest(method, req);
				const response = this.callHandler(method, controller, req);
				if (response) {
					if (response instanceof Promise) {
						response.then(r => this.sendResponse(res, r)).catch(error => this.sendError(error, req.path, res));
					} else {
						this.sendResponse(res, response);
					}
				} else {
					res.end();
				}
			} catch (error) {
				this.sendError(error, req.path, res);
			}
		};
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
	 * Calls the handler defined in the lifecycle method if it is a function.
	 * @param method lifecycle method definition
	 * @param server server definition
	 */
	private callLifecycleMethod(method: ServerLifecycleMethod, server: Server): Promise<any> {
		if (method && method instanceof ServerLifecycleMethod && typeof method.handler === 'function') {
			return Promise.resolve(method.handler.apply(server.instance));
		} else {
			return Promise.resolve(null);
		}
	}

	/**
	 * Validates the http request with using RequestValidator class.
	 * @throws RestError if validation fails
	 * @param method method and its arguments definitions
	 * @param req request instance of express app
	 */
	private validateRequest(method: Method, req: express.Request): void {
		new RequestValidator(req, method).validate();
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
		const requestBodies = method.getArgsByType(MethodArgType.REQUEST_BODY);
		const requestHeaders = method.getArgsByType(MethodArgType.REQUEST_HEADER);

		const args: any[] = Array.from(new Array(method.getMaxArgPosition()));
		for (const p of queryParams) args[p.position] = req.query[p.getConfig<IQueryParamConfig>().key];
		for (const v of pathVariables) args[v.position] = req.params[v.getConfig<IPathVariableConfig>().key];
		for (const b of requestBodies) args[b.position] = req.body;
		for (const h of requestHeaders) args[h.position] = req.headers;

		return args;
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
	 * @param path request path
	 * @param res response instance of express app
	 */
	private sendError(error: any, path: string, res: express.Response): void {
		const restError = this.getAsRestError(error, path);
		res.status(restError.code).send(restError.toErrorResponse());
	}

	/**
	 * Converts everything to the RestError type.
	 * @param error error instance
	 * @param path request path
	 */
	private getAsRestError(error: any, path: string): RestError {
		if (error instanceof RestError) return error.setPath(path);
		if (error instanceof Error) return new RestError(error.message).setPath(path);
		return new RestError('Internal server error occured').setPath(path);
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
	 * @param path request path
	 * @param messages messages to be printed
	 */
	private log(cname: string, mname: string, path: string, ...messages: any[]): void {
		logger.verbose(`[${cname}] [${mname.toUpperCase()} ${path}]`, messages.join(' '));
	}
}
