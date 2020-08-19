import { Types } from 'kahve-core';
import { RestAppManager } from '../internals';

/**
 * Class annotation to define the class as a controller
 *
 * @param path base path of controller, this will be used to generate full
 * endpoint path during registeration of the REST API endpoints
 *
 * @example
 * ```ts
 * @RestController('base/url')
 * class MyController {
 *
 *   @RestGet('path/to/users')
 *   public getUsers(): User[] {
 *     // Request: "GET base/url/path/to/users"
 *     return this.getAllUsers();
 *   }
 * }
 * ```
 */
export function RestController(path?: string): Types.ClassAnnotationReturnType {
	return function <T extends Types.Constructor>(ctor: T) {
		return class extends ctor {
			constructor(...args: any[]) {
				super(...args);
				Object.defineProperty(this.constructor, 'name', { value: ctor.name });
				RestAppManager.addController(ctor.name, path, this);
			}
		};
	};
}
