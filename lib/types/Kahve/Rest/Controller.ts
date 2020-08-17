import { Method } from './Method';

/**
 * @internal
 */
export class Controller {
	private methods: Method[] = [];

	constructor(public name: string, public baseUrl?: string) {}

	public addMethod(m: Method): this {
		if (m instanceof Method) this.methods.push(m);
		return this;
	}

	public addMethodSafe(m: Method): this {
		if (!this.isMethodExist(m.name)) this.addMethod(m);
		return this;
	}

	public getMethod(name: string): Method {
		return this.methods.find(m => m.name === name);
	}

	public getMethods(): Method[] {
		return this.methods;
	}

	public isMethodExist(name: string): boolean {
		return this.methods.findIndex(c => c.name === name) >= 0;
	}
}
