/**
 * @internal
 */
export enum MethodArgType {
	QUERY_PARAM,
	PATH_VARIABLE,
	REQUEST_BODY,
	REQUEST_HEADER
}

/**
 * @internal
 */
interface IArgWithKeyConfig {
	key: string;
}

/**
 * @internal
 */
export interface IQueryParamConfig extends IArgWithKeyConfig {}

/**
 * @internal
 */
export interface IPathVariableConfig extends IArgWithKeyConfig {}

/**
 * @internal
 */
export interface IRequestBodyConfig {}

/**
 * @internal
 */
export interface IRequestHeaderConfig {}

/**
 * @internal
 */
type ConfigTypes = IQueryParamConfig | IPathVariableConfig | IRequestBodyConfig | IRequestHeaderConfig;

/**
 * @internal
 */
interface IMethodArg {
	position: number;
	type: MethodArgType;
	required?: boolean;
	config?: ConfigTypes;
}

/**
 * @internal
 */
export class MethodArg implements IMethodArg {
	public position: number;
	public type: MethodArgType;
	public required?: boolean = false;
	public config?: ConfigTypes;

	constructor(obj?: IMethodArg) {
		if (obj) Object.assign(this, obj);
	}

	public getConfig<T>(): T {
		return this.config as T;
	}

	public setQueryParamConfig(c: IQueryParamConfig): this {
		return this.setConfig(c);
	}

	public setPathVariableConfig(c: IPathVariableConfig): this {
		return this.setConfig(c);
	}

	public setRequestBodyConfig(c: IRequestBodyConfig): this {
		return this.setConfig(c);
	}

	public setRequestHeaderConfig(c: IRequestHeaderConfig): this {
		return this.setConfig(c);
	}

	private setConfig(c: ConfigTypes): this {
		this.config = c;
		return this;
	}
}
