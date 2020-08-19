import { Controller } from './Controller';

/**
 * Rest application type which will be stored in the global variable.
 * @internal
 */
export class App {
	private controllers: Controller[] = [];

	/**
	 * Retrieves controller with name.
	 *
	 * @param name controller name to be retrieved
	 */
	public getController(name: string): Controller {
		return this.controllers.find(c => c.name === name);
	}

	/**
	 * Get all controllers defined as a list.
	 */
	public getControllers(): Controller[] {
		return this.controllers;
	}

	/**
	 * Checks the controller is in list or not.
	 *
	 * @param name controller name
	 */
	public isControllerExist(name: string): boolean {
		return this.controllers.findIndex(c => c.name === name) >= 0;
	}

	/**
	 * Adds controller to the list if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param c controller
	 */
	public addController(c: Controller): this {
		if (!this.isControllerExist(c.name)) this.insertController(c);
		else this.updateController(c);
		return this;
	}

	/**
	 * Inserts controller to the list.
	 * @param c controller
	 */
	private insertController(c: Controller): this {
		if (c instanceof Controller) this.controllers.push(c);
		return this;
	}

	/**
	 * Updates controller with coping the values.
	 * @param c controller
	 */
	private updateController(c: Controller): this {
		const foundIndex = this.controllers.findIndex(controller => controller.name === c.name);

		if (foundIndex >= 0) {
			Object.entries(c)
				.filter(([, value]) => value)
				.forEach(([key, value]) => (this.controllers[foundIndex][key] = value));
		}

		return this;
	}
}
