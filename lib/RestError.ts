import { ErrorResponse } from 'kahve-core';
import { HttpStatus } from './HttpStatus';

/**
 * Custom error implementation for REST api error which can be used.
 */
export class RestError extends Error {
	public timestamp: Date = new Date();

	constructor(message: string, public code: number = HttpStatus.INTERNAL_SERVER_ERROR, public path: string = '', public data?: any) {
		super(message);
		Object.setPrototypeOf(this, RestError.prototype);
	}

	/**
	 * Updates the path variable.
	 *
	 * @param path path to be updated
	 */
	public setPath(path: string): this {
		this.path = path;
		return this;
	}

	/**
	 * Updates the code variable.
	 *
	 * @param code status code to be updated
	 */
	public setCode(code: number): this {
		this.code = code;
		return this;
	}

	/**
	 * Converts it to the ErrorResponse message type
	 */
	public toErrorResponse(): ErrorResponse {
		return new ErrorResponse({
			error: HttpStatus.getStatusText(this.code),
			message: this.message,
			path: this.path,
			status: this.code,
			timestamp: this.timestamp,
			data: this.data
		});
	}
}
