import { Types } from 'kahve-core';
import { Helper } from '../internals';
import { HttpMethod } from '../types/Kahve/rest/HttpMethod';

/**
 * Method annotation to register the method as a handler of http **POST** request
 * with the defined endpoint path
 *
 * @param path endpoint url - this will be used with the base path defined within
 * RestController
 *
 * @example
 * ```ts
 * @RestController('base/url')
 * class MyController {
 *
 *   @RestPost('path/to/user')
 *   public createUser(@RequestBody() user: User): User {
 *      console.log('New user:', user);
 *      return user;
 *      // Request Path: "POST base/url/path/to/user"
 *      // Expected Output: "New user: {"name": "John", "surname": "Doe", ...}"
 *   }
 * }
 * ```
 */
export function RestPost(path?: string): Types.MethodAnnotationReturnType {
	return Helper.httpMethodAnnotationGenerator(HttpMethod.POST, path);
}
