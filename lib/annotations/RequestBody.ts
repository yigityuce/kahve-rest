import { Types } from 'kahve-core';
import { RestAppManager, Helper } from '../internals';
import { MethodArg, MethodArgType } from '../types/Kahve/Rest';

/**
 * Method argument annotation to get request body
 * @param required - define is request body required or not. It will be validated automatically when request is received. If it
 * does not pass the validation, automatic error response will be generated
 *
 * @example
 * ```ts
 * @RestController('base/url')
 * class MyController {
 *
 *   @RestPost('path/to/user')
 *   public updateUser(@RequestBody() user: User): void {
 *      console.log('New user info:', user);
 *      // Request Path: "POST base/url/path/to/user"
 *      // Expected Output: "New user info: {"name": "John", "surname": "Doe", ...}"
 *   }
 * }
 * ```
 */
export function RequestBody(required: boolean = false): Types.ParameterAnnotationReturnType {
	return (obj: any, func: string, position: number): void => {
		const arg = new MethodArg({
			position,
			required,
			type: MethodArgType.REQUEST_BODY
		});
		RestAppManager.addMethodArg(Helper.getClassName(obj), func, arg);
	};
}
