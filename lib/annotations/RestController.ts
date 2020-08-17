import { Types } from 'kahve-core';
import { RestAppManager } from '../internals';

export function RestController(path?: string): Types.ClassAnnotationReturnType {
	return function <T extends Types.Constructor>(ctor: T) {
		return class extends ctor {
			constructor(...args: any[]) {
				super(...args);
				Object.defineProperty(this.constructor, 'name', { value: ctor.name });
				RestAppManager.addController(ctor.name, path);
			}
		};
	};
}
