import { GlobalVariableHelper } from 'kahve-core';
import { Kahve } from '../types';
import { App, Controller, Method } from '../types/Kahve/Rest';

/**
 * @internal
 */
export class RestAppManager {
	public static getRestApp(): Kahve.Rest.App {
		GlobalVariableHelper.initGlobal();
		if (!global.kahve.rest) global.kahve.rest = new App();
		return global.kahve.rest;
	}

	public static addController(cname: string, baseUrl: string): void {
		RestAppManager.getRestApp().addControllerSafe(new Controller(cname)).getController(cname).baseUrl = baseUrl;
	}

	public static addMethod(cname: string, method: Kahve.Rest.Method): void {
		RestAppManager.getRestApp().addControllerSafe(new Controller(cname)).getController(cname).addMethodSafe(method);
	}

	public static addMethodArg(cname: string, mname: string, arg: Kahve.Rest.MethodArg): void {
		RestAppManager.getRestApp()
			.addControllerSafe(new Controller(cname))
			.getController(cname)
			.addMethodSafe(new Method({ name: mname, httpMethod: null }))
			.getMethod(mname)
			.addArgSafe(arg);
	}
}
