import { HttpMethod, Method } from '../types/Kahve/Rest';
import { Types } from 'kahve-core';
import { RestAppManager } from './RestAppManager';

/**
 * @internal
 */
export class Helper {
	/**
	 * Helper method to generate annotation for http request methods like GET, POST etc.
	 *
	 * @param httpMethod - http method to be generated as annotation
	 * @param path - request path to be bound
	 */
	public static httpMethodAnnotationGenerator(httpMethod: HttpMethod, path?: string): Types.MethodAnnotationReturnType {
		return (obj: any, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
			const method = new Method({
				name,
				httpMethod,
				path,
				handler: (...args: any[]) => descriptor.value.call(obj, ...args)
			});
			RestAppManager.addMethod(Helper.getClassName(obj), method);
			return descriptor;
		};
	}

	/**
	 * Helper method to get class name from object instance
	 * @param obj object instance
	 */
	public static getClassName(obj: any): string {
		if (obj && obj.constructor && obj.constructor.name) return obj.constructor.name;
		return 'ANONYMOUS_CLASS';
	}
}
