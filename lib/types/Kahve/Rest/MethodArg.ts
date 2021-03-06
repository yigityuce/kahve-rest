import { RestAppManager } from '../../../internals';

/**
 * Available method argument types.
 * @internal
 */
export enum MethodArgType {
	QUERY_PARAM = 'QUERY_PARAM',
	PATH_VARIABLE = 'PATH_VARIABLE',
	REQUEST_BODY = 'REQUEST_BODY',
	REQUEST_HEADER = 'REQUEST_HEADER',
	REQUEST_HEADERS = 'REQUEST_HEADERS'
}

/**
 * Method arg config interface definition for argument config with the key property.
 * @internal
 */
interface IArgWithKeyConfig {
	key: string;
}

/**
 * Method arg config interface definition for query param.
 * @internal
 */
export interface IQueryParamConfig extends IArgWithKeyConfig {}

/**
 * Method arg config interface definition for path variable.
 * @internal
 */
export interface IPathVariableConfig extends IArgWithKeyConfig {}

/**
 * Method arg config interface definition for a single header.
 * @internal
 */
export interface IRequestHeaderConfig extends IArgWithKeyConfig {}

/**
 * Method arg config interface definition for request body.
 * @internal
 */
export interface IRequestBodyConfig {}

/**
 * Method arg config interface definition for headers.
 * @internal
 */
export interface IRequestHeadersConfig {}

/**
 * Custom type definition for method arg config property.
 * @internal
 */
type ConfigTypes = IQueryParamConfig | IPathVariableConfig | IRequestBodyConfig | IRequestHeadersConfig;

/**
 * Method arg type which will be stored in the method.
 *
 * @internal
 */
export class MethodArg {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;

	constructor(public position: number, public type: MethodArgType, public config?: ConfigTypes, public required: boolean = false) {}

	/**
	 * Retrieves config for method arg.
	 */
	public getConfig<T>(): T {
		return this.config as T;
	}
}
