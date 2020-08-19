import 'kahve-core';
import { Kahve } from './types';

/**
 * Type extension for "kahve" named variable defined in the global variable
 * @internal
 */
declare module 'kahve-core' {
	export namespace Types {
		export interface IGlobalKahve {
			rest: Kahve.Rest.App;
		}
	}
}
