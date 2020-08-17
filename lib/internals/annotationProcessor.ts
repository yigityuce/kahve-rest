import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { logger } from 'kahve-core';
import { RestError } from '../RestError';
import { Method, MethodArgType, IQueryParamConfig, IPathVariableConfig } from '../types/Kahve/Rest';
import { RestAppManager } from './RestAppManager';
import { MethodArgValidator } from './validator/MethodArgValidator';

/**
 * @internal
 */
class AnnotationProcessor {
	public process(app: express.Application): void {
		RestAppManager.getRestApp()
			.getControllers()
			.forEach(controller => {
				controller.getMethods().forEach(method => {
					const path = this.generatePath(controller.baseUrl, method.path);
					const httpMethod = method.httpMethod.toLowerCase();
					if (this.isValidHttpMethod(app, httpMethod)) {
						this.log(controller.name, httpMethod, path, 'Endpoint is registered');
						app[httpMethod](path, this.generateRequestHandler(method, controller.name, path));
					}
				});
			});
	}

	private generatePath(...pieces: string[]): string {
		return `/${[...pieces.filter(p => p)]
			.join('/')
			.split('/')
			.filter(p => p)
			.join('/')}`;
	}

	private isValidHttpMethod(app: express.Application, httpMethod: string): boolean {
		return httpMethod in app && typeof app[httpMethod] === 'function';
	}

	private generateRequestHandler(method: Method, controllerName: string, path: string): Function {
		return (req: express.Request, res: express.Response) => {
			try {
				this.logRequest(req, controllerName, method, path);
				const response = method.handler.apply(null, this.generateCallbackArgs(method, req));
				if (response) {
					if (response instanceof Promise) {
						response.then(r => this.sendResponse(res, r)).catch(error => this.sendError(error, req, res));
					} else {
						this.sendResponse(res, response);
					}
				}
			} catch (error) {
				this.sendError(error, req, res);
			}
		};
	}

	private generateCallbackArgs(method: Method, req: express.Request): any[] {
		const queryParams = method.getArgsByType(MethodArgType.QUERY_PARAM);
		const pathVariables = method.getArgsByType(MethodArgType.PATH_VARIABLE);
		const requestBodies = method.getArgsByType(MethodArgType.REQUEST_BODY);
		const requestHeaders = method.getArgsByType(MethodArgType.REQUEST_HEADER);

		queryParams.forEach(arg => new MethodArgValidator(arg, req).validate());
		pathVariables.forEach(arg => new MethodArgValidator(arg, req).validate());
		requestBodies.forEach(arg => new MethodArgValidator(arg, req).validate());
		requestHeaders.forEach(arg => new MethodArgValidator(arg, req).validate());

		const callbackArgs: any[] = Array.from(new Array(method.getMaxArgPosition()));
		for (const p of queryParams) callbackArgs[p.position] = req.query[p.getConfig<IQueryParamConfig>().key];
		for (const v of pathVariables) callbackArgs[v.position] = req.params[v.getConfig<IPathVariableConfig>().key];
		for (const b of requestBodies) callbackArgs[b.position] = req.body;
		for (const h of requestHeaders) callbackArgs[h.position] = req.headers;

		return callbackArgs;
	}

	private sendResponse(res: express.Response, response: any): void {
		res.status(HttpStatus.OK).send(response);
	}

	private sendError(error: any, req: express.Request, res: express.Response): void {
		const restError = this.getAsRestError(error, req.path);
		res.status(restError.status).send(restError.toErrorResponse());
	}

	private getAsRestError(error: any, path: string): RestError {
		if (error instanceof RestError) return error.setPath(path);
		if (error instanceof Error) return new RestError(error.message, path);
		return new RestError('Internal server error occured', path);
	}

	private logRequest(req: express.Request, controllerName: string, method: Method, path: string): void {
		const logDetails = [];
		if (Object.keys(req.params).length) logDetails.push('Path variables', JSON.stringify(req.params));
		if (Object.keys(req.query).length) logDetails.push('Query params:', JSON.stringify(req.query));
		if (Object.keys(req.headers).length) logDetails.push('Header:', JSON.stringify(req.headers));
		if (Object.keys(req.body).length) logDetails.push('Body:', JSON.stringify(req.body));

		this.log(controllerName, method.httpMethod, path, 'Request is received.', ...logDetails);
	}

	private log(controller: string, method: string, path: string, ...messages: any[]): void {
		logger.debug(`[${controller}] [${method.toUpperCase()} ${path}]`, messages.join(' '));
	}
}

/**
 * @internal
 */
export const annotationProcessor = new AnnotationProcessor();
