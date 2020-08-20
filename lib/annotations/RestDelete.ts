import { Types } from 'kahve-core';
import { Helper } from '../internals';
import { HttpMethod } from '../types/Kahve/rest/HttpMethod';

/**
 * Method annotation to register the method as a handler of http **DELETE** request
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
 *   @RestDelete('path/to/user/:id')
 *   public deleteUser(@PathVariable('id') userid: number): boolean {
 *     // Request: "DELETE base/url/path/to/user/123"
 *     return true;
 *   }
 * }
 * ```
 */
export function RestDelete(path?: string): Types.MethodAnnotationReturnType {
	return Helper.httpMethodAnnotationGenerator(HttpMethod.DELETE, path);
}
