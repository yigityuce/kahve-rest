import { Method } from '../types/Kahve/Rest';
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
	public static httpMethodAnnotationGenerator(httpMethod: string, path?: string): Types.MethodAnnotationReturnType {
		return (obj: any, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
			Object.defineProperty(obj, name, descriptor);
			RestAppManager.addMethod(Helper.getClassName(obj), new Method(name, httpMethod, path, descriptor.value, null));
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
