import { Types } from 'kahve-core';
import { Helper, RestAppManager } from '../internals';
import { ServerLifecycleMethod, ServerLifecylceMethodType } from '../types/Kahve/Rest';

export function RestServerPostStart(): Types.MethodAnnotationReturnType {
	return (obj: any, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		Object.defineProperty(obj, name, descriptor);
		RestAppManager.addServerLifecycleMethod(
			Helper.getClassName(obj),
			new ServerLifecycleMethod(name, ServerLifecylceMethodType.POSTSTART, descriptor.value)
		);
		return descriptor;
	};
}
