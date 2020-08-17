import { Types } from 'kahve-core';
import { RestAppManager, Helper } from '../internals';
import { MethodArg, MethodArgType } from '../types/Kahve/Rest';

/**
 * Method argument annotation to get query parameter from the request with key
 * @param key - Query parameter key
 * @param required - define is query required or not. It will be validated automatically when request is received. If it
 * does not pass the validation, automatic error response will be generated
 *
 * @example
 * ```ts
 * @RestController('base/url')
 * class MyController {
 *
 *   @RestGet('path/to/user')
 *   public getUser(@QueryParam('id') userid: number): User {
 *      console.log('Requested user:', userid);
 *      // Request: "GET base/url/path/to/user?id=123"
 *      // Expected Output: "Requested user: 123"
 *   }
 * }
 * ```
 */
export function QueryParam(key: string, required: boolean = false): Types.ParameterAnnotationReturnType {
	return (obj: any, func: string, position: number): void => {
		const arg = new MethodArg({
			position,
			required,
			type: MethodArgType.QUERY_PARAM,
			config: { key }
		});
		RestAppManager.addMethodArg(Helper.getClassName(obj), func, arg);
	};
}
