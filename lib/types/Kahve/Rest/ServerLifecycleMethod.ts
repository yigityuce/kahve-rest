import { RestAppManager } from '../../../internals';

/**
 * Available server lifecycle method types.
 * @internal
 */
export enum ServerLifecylceMethodType {
	PRESTART = 'PRESTART',
	POSTSTART = 'POSTSTART'
}

/**
 * Server lifecycle method type which will be stored in the server.
 * @internal
 */
export class ServerLifecycleMethod {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;

	constructor(public name: string, public type: ServerLifecylceMethodType, public handler: Function) {}
}
