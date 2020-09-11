import { Method, MethodArgType, MethodArg, IQueryParamConfig, IRequestHeaderConfig } from '../types/Kahve/Rest';
import { RestError } from '../RestError';
import { HttpStatus } from '../HttpStatus';
import * as express from 'express';

/**
 * HTTP request validator implementation.
 *
 * @internal
 */
export class RequestValidator {
	constructor(private request: express.Request, private method: Method) {}

	/**
	 * Validates the http request.
	 *
	 * @throws RestError if validation fails
	 */
	public validate(): void {
		this.method.getArgs().forEach(arg => {
			if (arg.type === MethodArgType.QUERY_PARAM) this.validateQueryParam(arg);
			else if (arg.type === MethodArgType.REQUEST_BODY) this.validateRequestBody(arg);
			else if (arg.type === MethodArgType.REQUEST_HEADER) this.validateRequestHeader(arg);
		});
	}

	/**
	 * Checks the query params in the http request and fails if the query parameter is required and it is not sent via request
	 *
	 * @throws RestError if validation fails
	 */
	private validateQueryParam(arg: MethodArg): void {
		if (!arg.required) return;

		const queryParamKey = arg.getConfig<IQueryParamConfig>().key;
		if (!(queryParamKey in this.request.query)) {
			throw new RestError(`Missing required query parameter [${queryParamKey}]`, HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * Checks the request body in the http request and fails if the body is required and it is not sent via request
	 *
	 * @throws RestError if validation fails
	 */
	private validateRequestBody(arg: MethodArg): void {
		if (!arg.required) return;
		if (!this.request.body) throw new RestError(`Missing required request body`, HttpStatus.BAD_REQUEST);
	}

	/**
	 * Checks the request header in the http request and fails if the header is required and it is not sent via request
	 *
	 * @throws RestError if validation fails
	 */
	private validateRequestHeader(arg: MethodArg): void {
		if (!arg.required) return;

		const requestHeaderKey = arg.getConfig<IRequestHeaderConfig>().key;
		if (this.request.header(requestHeaderKey) === undefined) {
			throw new RestError(`Missing required request header [${requestHeaderKey}]`, HttpStatus.BAD_REQUEST);
		}
	}
}
