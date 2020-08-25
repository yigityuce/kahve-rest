import { RestAppManager } from '../../../internals';

/**
 * Server controller type which will be stored in the server.
 *
 * @internal
 */
export class ServerController {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;

	constructor(public name: string, public value: any) {}
}
