import { Types } from 'kahve-core';
import { RestAppManager, Helper } from '../internals';
import { RestServerConfigTypes } from '../types/Kahve/Rest';

/**
 * Property annotation to get property value as a server config.
 * The default configurations will be used for undefined properties.
 *
 * @example
 * ```ts
 * @RestServer()
 * class MyServer {
 *   @RestServerConfig('PORT')
 *   private port: number = 9000;
 *
 *   @RestServerController()
 *   private myController = new MyController(); // should be the class annotated with "@RestController"
 * }
 * ```
 */
export function RestServerConfig(config: RestServerConfigTypes): Types.PropertyAnnotationReturnType {
	return (obj: any, name: string): void => {
		RestAppManager.addServerConfig(Helper.getClassName(obj), config, name);
	};
}
