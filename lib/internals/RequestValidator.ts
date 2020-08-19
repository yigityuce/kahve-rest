import { Method, MethodArgType, MethodArg, IQueryParamConfig } from '../types/Kahve/Rest';
import { RestError } from '../RestError';
import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

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
		(this.method.args || []).forEach(arg => {
			if (arg.type === MethodArgType.QUERY_PARAM) this.validateQueryParam(arg);
			if (arg.type === MethodArgType.REQUEST_BODY) this.validateRequestBody(arg);
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
}
