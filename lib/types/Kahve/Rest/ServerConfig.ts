import { RestAppManager } from '../../../internals';

/**
 * Possible server config types.
 */
export type RestServerConfigTypes = 'PORT' | 'TEST';

/**
 * Server config type which will be stored in the server.
 *
 * @internal
 */
export class ServerConfig {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;

	constructor(public key: RestServerConfigTypes, public name: string, public value: any) {}
}
