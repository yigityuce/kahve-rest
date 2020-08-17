import 'kahve-core';
import { Kahve } from './types';

/**
 * @internal
 */
declare module 'kahve-core' {
	export namespace Types {
		export interface IGlobalKahve {
			rest: Kahve.Rest.App;
		}
	}
}
