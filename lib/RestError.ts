import { ErrorResponse } from 'kahve-core';
import * as HttpStatus from 'http-status-codes';

export class RestError extends Error {
	public timestamp: Date = new Date();

	constructor(message: string, public path: string = '', public status: number = HttpStatus.INTERNAL_SERVER_ERROR, public data?: any) {
		super(message);
	}

	public setPath(path: string): this {
		this.path = path;
		return this;
	}

	public toErrorResponse(): ErrorResponse {
		return new ErrorResponse({
			error: HttpStatus.getStatusText(this.status),
			message: this.message,
			path: this.path,
			status: this.status,
			timestamp: this.timestamp,
			data: this.data
		});
	}
}
