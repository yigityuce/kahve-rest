import { Types } from 'kahve-core';
import { RestAppManager, Helper } from '../internals';
import { MethodArg, MethodArgType } from '../types/Kahve/Rest';

/**
 * Method argument annotation to get path variable from the request with key
 *
 * @param key - Path variable name which is defined on the path with leading colon
 *
 * @example
 * ```ts
 * @RestController('base/url')
 * class MyController {
 *
 *   @RestGet('path/to/user/:id')
 *   public getUser(@PathVariable('id') userid: number): User {
 *      console.log('Requested user:', userid);
 *      // Request: "GET base/url/path/to/user/123"
 *      // Expected Output: "Requested user: 123"
 *   }
 * }
 * ```
 */
export function PathVariable(key: string): Types.ParameterAnnotationReturnType {
	return (obj: any, func: string, position: number): void => {
		const arg = new MethodArg(position, MethodArgType.PATH_VARIABLE, { key }, true);
		RestAppManager.addMethodArg(Helper.getClassName(obj), func, arg);
	};
}
