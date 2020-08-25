import { Method } from './Method';
import { RestAppManager, UniqueList } from '../../../internals';

/**
 * Controller type which will be stored in the application instance.
 * @internal
 */
export class Controller {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;
	private methods: UniqueList<Method> = new UniqueList<Method>('name');

	constructor(public name: string, public baseUrl: string, public instance: any) {}

	/**
	 * Retrieves method with name.
	 *
	 * @param name method name to be retrieved
	 */
	public getMethod(name: string): Method {
		return this.methods.get(name);
	}

	/**
	 * Get all methods defined as a list.
	 */
	public getMethods(): Method[] {
		return this.methods.getAll();
	}

	/**
	 * Adds method to the list in controller if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param m method
	 */
	public addMethod(m: Method): this {
		this.methods.add(m);
		return this;
	}
}
