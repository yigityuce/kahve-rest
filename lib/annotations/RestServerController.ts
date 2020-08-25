import { Types } from 'kahve-core';
import { RestAppManager, Helper } from '../internals';

/**
 * Property annotation to bind controller which is annotated with "@RestController" and the server.
 * **Don't forget to instantiate property. !**
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
export function RestServerController(): Types.PropertyAnnotationReturnType {
	return (obj: any, name: string): void => {
		RestAppManager.addServerController(Helper.getClassName(obj), name);
	};
}
