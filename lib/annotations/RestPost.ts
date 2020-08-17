import { Types } from 'kahve-core';
import { Helper } from '../internals';
import { HttpMethod } from '../types/Kahve/rest';

export function RestPost(path?: string): Types.MethodAnnotationReturnType {
	return Helper.httpMethodAnnotationGenerator(HttpMethod.POST, path);
}
