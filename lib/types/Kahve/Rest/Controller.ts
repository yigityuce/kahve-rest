import { Method } from './Method';
import { RestAppManager } from '../../../internals';

/**
 * Controller type which will be stored in the application instance.
 * @internal
 */
export class Controller {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;
	private methods: Method[];

	constructor(public name: string, public baseUrl: string, public instance: any) {}

	/**
	 * Retrieves method with name.
	 *
	 * @param name method name to be retrieved
	 */
	public getMethod(name: string): Method {
		return (this.methods || []).find(m => m.name === name);
	}

	/**
	 * Get all methods defined as a list.
	 */
	public getMethods(): Method[] {
		return this.methods || [];
	}

	/**
	 * Checks the method is in list or not.
	 * @param name method name
	 */
	public isMethodExist(name: string): boolean {
		return (this.methods || []).findIndex(c => c.name === name) >= 0;
	}

	/**
	 * Adds method to the list in controller if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param m method
	 */
	public addMethod(m: Method): this {
		if (!this.isMethodExist(m.name)) this.insertMethod(m);
		else this.updateMethod(m);
		return this;
	}

	/**
	 * Inserts method to the list in controller.
	 * @param m method
	 */
	private insertMethod(m: Method): this {
		if (m instanceof Method) {
			if (!Array.isArray(this.methods)) this.methods = [];
			this.methods.push(m);
		}
		return this;
	}

	/**
	 * Updates method with coping the values.
	 * @param m method
	 */
	private updateMethod(method: Method): this {
		const foundIndex = (this.methods || []).findIndex(m => m.name === method.name);

		if (foundIndex >= 0) {
			Object.entries(method)
				.filter(([, value]) => value)
				.forEach(([key, value]) => (this.methods[foundIndex][key] = value));
		}

		return this;
	}
}
