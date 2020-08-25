import { MethodArg, MethodArgType } from './MethodArg';
import { RestAppManager, UniqueList } from '../../../internals';

/**
 * Method type which will be stored in the controller.
 * @internal
 */
export class Method {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;
	private args: UniqueList<MethodArg> = new UniqueList<MethodArg>('position');

	constructor(public name: string, public httpMethod: string, public path: string, public handler: Function) {}

	/**
	 * Retrieves method arg with position.
	 *
	 * @param position argument index to be retrieved
	 */
	public getArg(position: number): MethodArg {
		return this.args.get(position);
	}

	/**
	 * Get all method args defined as a list.
	 */
	public getArgs(): MethodArg[] {
		return this.args.getAll();
	}

	/**
	 * Get all methods args with the argument type like QUERY_PARAM, PATH_VARIABLE etc.
	 */
	public getArgsByType(type: MethodArgType): MethodArg[] {
		const args = this.args.getAll();
		return args.filter(c => c.type === type);
	}

	/**
	 * Get the max possible argument position.
	 */
	public getMaxArgPosition(): number {
		const args = this.args.getAll();
		const positionList = args.map(a => a.position);
		return positionList.length ? Math.max(...positionList) : 0;
	}

	/**
	 * Adds argument to the list in the method if it is not already in list.
	 * @param a method argument
	 */
	public addMethodArg(a: MethodArg): this {
		this.args.add(a);
		return this;
	}
}
