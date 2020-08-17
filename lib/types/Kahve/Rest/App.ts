import { Controller } from './Controller';

/**
 * @internal
 */
export class App {
	private controllers: Controller[] = [];

	public addController(c: Controller): this {
		if (c instanceof Controller) this.controllers.push(c);
		return this;
	}

	public addControllerSafe(c: Controller): this {
		if (!this.isControllerExist(c.name)) this.addController(c);
		return this;
	}

	public getController(name: string): Controller {
		return this.controllers.find(c => c.name === name);
	}

	public getControllers(): Controller[] {
		return this.controllers;
	}

	public isControllerExist(name: string): boolean {
		return this.controllers.findIndex(c => c.name === name) >= 0;
	}
}
