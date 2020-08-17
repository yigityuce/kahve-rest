import { Types } from 'kahve-core';
import { RestAppManager, Helper } from '../internals';
import { MethodArg, MethodArgType } from '../types/Kahve/Rest';

/**
 * Method argument annotation to get request headers
 *
 * @example
 * ```ts
 * @RestController('base/url')
 * class MyController {
 *
 *   @RestPost('auth')
 *   public auth(@RequestHeaders() headers: any): void {
 *      console.log('Auth request received with this header:', headers);
 *      // Request Path: "POST base/url/auth"
 *      // Expected Output: "Auth request received with this header: {"Content-Type": "application/json", "Authorization": "Bearer xyz", ...}"
 *   }
 * }
 * ```
 */
export function RequestHeaders(): Types.ParameterAnnotationReturnType {
	return (obj: any, func: string, position: number): void => {
		const arg = new MethodArg({
			position,
			type: MethodArgType.REQUEST_HEADER
		});
		RestAppManager.addMethodArg(Helper.getClassName(obj), func, arg);
	};
}
