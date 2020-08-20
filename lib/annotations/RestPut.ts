import { Types } from 'kahve-core';
import { Helper } from '../internals';
import { HttpMethod } from '../types/Kahve/rest/HttpMethod';

/**
 * Method annotation to register the method as a handler of http **PUT** request
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
 *   @RestPut('path/to/user/:id')
 *   public updateUser(@RequestBody() user: User, @PathVariable('id') id: number): User {
 *      console.log('Update user info:', user);
 *      return user;
 *      // Request Path: "PUT base/url/path/to/user/123"
 *      // Expected Output: "Update user info: {"name": "John", "surname": "Doe", ...}"
 *   }
 * }
 */
export function RestPut(path?: string): Types.MethodAnnotationReturnType {
	return Helper.httpMethodAnnotationGenerator(HttpMethod.PUT, path);
}
