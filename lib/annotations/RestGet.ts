import { Types } from 'kahve-core';
import { Helper } from '../internals';
import { HttpMethod } from '../types/Kahve/rest/HttpMethod';

/**
 * Method annotation to register the method as a handler of http **GET** request
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
 *   @RestGet('path/to/users')
 *   public getUsers(): User[] {
 *     // Request: "GET base/url/path/to/users"
 *     return this.getAllUsers();
 *   }
 * }
 * ```
 */
export function RestGet(path?: string): Types.MethodAnnotationReturnType {
	return Helper.httpMethodAnnotationGenerator(HttpMethod.GET, path);
}
