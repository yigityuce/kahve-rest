import { Types } from 'kahve-core';
import { RestAppManager, Helper } from '../internals';
import { MethodArg, MethodArgType } from '../types/Kahve/Rest';

/**
 * Method argument annotation to get a single request header
 *
 * @example
 * ```ts
 * @RestController('base/url')
 * class MyController {
 *
 *   @RestPost('auth')
 *   public auth(@RequestHeader('Authorization', true) authHeader: string): void {
 *      console.log('Auth header is:', authHeader);
 *      // Request Path: "POST base/url/auth"
 *      // Expected Output: "Auth header is: "Bearer xyz"
 *   }
 * }
 * ```
 */
export function RequestHeader(key: string, required: boolean = false): Types.ParameterAnnotationReturnType {
	return (obj: any, func: string, position: number): void => {
		const arg = new MethodArg(position, MethodArgType.REQUEST_HEADER, { key }, required);
		RestAppManager.addMethodArg(Helper.getClassName(obj), func, arg);
	};
}
