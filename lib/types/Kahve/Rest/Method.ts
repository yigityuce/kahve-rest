import { MethodArg, MethodArgType } from './MethodArg';

/**
 * @internal
 */
export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

/**
 * @internal
 */
const NOOP: Function = () => {};

/**
 * @internal
 */
interface IMethod {
	httpMethod: HttpMethod | string;
	name: string;
	path?: string;
	handler?: Function;
	args?: MethodArg[];
}

/**
 * @internal
 */
export class Method implements IMethod {
	public httpMethod: HttpMethod | string;
	public name: string;
	public path?: string;
	public handler?: Function = NOOP;
	public args?: MethodArg[] = [];

	constructor(obj?: IMethod) {
		if (obj) {
			Object.assign(this, obj);
			if (Array.isArray(obj.args)) this.args = obj.args.map(a => new MethodArg(a));
		}
	}

	public addArg(a: MethodArg): this {
		if (a instanceof MethodArg) this.args.push(a);
		return this;
	}

	public addArgSafe(a: MethodArg): this {
		if (!this.isArgExist(a.position)) this.addArg(a);
		return this;
	}

	public getArg(position: number): MethodArg {
		return this.args.find(c => c.position === position);
	}

	public isArgExist(position: number): boolean {
		return this.args.findIndex(c => c.position === position) >= 0;
	}

	public getArgsByType(type: MethodArgType): MethodArg[] {
		return this.args.filter(c => c.type === type);
	}

	public getMaxArgPosition(): number {
		const positionList = this.args.map(a => a.position);
		return positionList.length ? Math.max(...positionList) : 0;
	}
}
