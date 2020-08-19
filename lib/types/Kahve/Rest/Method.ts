import { MethodArg, MethodArgType } from './MethodArg';
import { RestAppManager } from '../../../internals';

/**
 * Available HTTP methods to be used to register REST endpoint.
 * @internal
 */
export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

/**
 * Method type which will be stored in the controller.
 * @internal
 */
export class Method {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;

	constructor(
		public name: string,
		public httpMethod: HttpMethod,
		public path: string,
		public handler: Function,
		public args: MethodArg[]
	) {}

	/**
	 * Retrieves method arg with position.
	 *
	 * @param position argument index to be retrieved
	 */
	public getArg(position: number): MethodArg {
		return (this.args || []).find(a => a.position === position);
	}

	/**
	 * Checks the method arg is in list
	 *
	 * @param position argument index to be retrieved
	 */
	public isArgExist(position: number): boolean {
		return (this.args || []).findIndex(c => c.position === position) >= 0;
	}

	/**
	 * Get all methods args with the argument type like QUERY_PARAM, PATH_VARIABLE etc.
	 */
	public getArgsByType(type: MethodArgType): MethodArg[] {
		return (this.args || []).filter(c => c.type === type);
	}

	/**
	 * Get the max possible argument position.
	 */
	public getMaxArgPosition(): number {
		const positionList = (this.args || []).map(a => a.position);
		return positionList.length ? Math.max(...positionList) : 0;
	}

	/**
	 * Adds argument to the list in the method if it is not already in list.
	 * @param a method argument
	 */
	public addMethodArg(a: MethodArg): this {
		if (!this.isArgExist(a.position)) this.insertMethodArg(a);
		else this.updateMethodArg(a);
		return this;
	}

	/**
	 * Inserts method arg to the list in controller.
	 * @param a method arg
	 */
	private insertMethodArg(a: MethodArg): this {
		if (a instanceof MethodArg) {
			if (!Array.isArray(this.args)) this.args = [];
			this.args.push(a);
		}
		return this;
	}

	/**
	 * Updates method arg with coping the values.
	 * @param a method arg
	 */
	private updateMethodArg(a: MethodArg): this {
		const foundIndex = (this.args || []).findIndex(arg => arg.position === a.position);

		if (foundIndex >= 0) {
			Object.entries(a)
				.filter(([, value]) => value)
				.forEach(([key, value]) => (this.args[foundIndex][key] = value));
		}

		return this;
	}
}
