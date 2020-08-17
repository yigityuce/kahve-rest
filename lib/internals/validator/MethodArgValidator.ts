import { ValidatorBase } from './ValidatorBase';
import { MethodArg, MethodArgType, IQueryParamConfig } from '../../types/Kahve/Rest';
import { RestError } from '../../RestError';
import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

/**
 * @internal
 */
export class MethodArgValidator extends ValidatorBase {
	constructor(private arg: MethodArg, private request: express.Request) {
		super();
	}

	public validate(): void {
		if (this.arg.type === MethodArgType.QUERY_PARAM) this.validateQueryParam();
		if (this.arg.type === MethodArgType.REQUEST_BODY) this.validateRequestBody();
	}

	private validateQueryParam(): void {
		if (!this.arg.required) return;

		const queryParamKey = this.arg.getConfig<IQueryParamConfig>().key;
		if (!(queryParamKey in this.request.query)) {
			throw new RestError(`Missing required query parameter [${queryParamKey}]`, '', HttpStatus.BAD_REQUEST);
		}
	}

	private validateRequestBody(): void {
		if (!this.arg.required) return;
		if (!this.request.body) throw new Error(`Missing required request body`);
	}
}
