import { GlobalVariableHelper } from 'kahve-core';
import { Kahve } from '../types';
import { App, Controller, Method } from '../types/Kahve/Rest';

/**
 * Global variable manager class implementation.
 * It will be used to add controllers, methods and method args to the global variable to process them later on.
 * Methods belong to the class will be used inside the annotation methods.
 *
 * @internal
 */
export class RestAppManager {
	/**
	 * Used to identify every single record in the global variable.
	 */
	public static AUTO_INCREMENT_ID: number = 0;

	/**
	 * Creates the app instance if it is not exist in the global variable and returns the newly created or already exist app instance.
	 */
	public static app(): Kahve.Rest.App {
		GlobalVariableHelper.initGlobal();
		if (!global.kahve.rest) global.kahve.rest = new App();
		return global.kahve.rest;
	}

	/**
	 * Adds controller to the app instance.
	 *
	 * @param cname controller name
	 * @param baseUrl base url of the controller
	 */
	public static addController(cname: string, baseUrl: string, instance: any): void {
		RestAppManager.app().addController(new Controller(cname, baseUrl, instance));
	}

	/**
	 * Adds method to the controller.
	 *
	 * @param cname controller name
	 * @param method method definition
	 */
	public static addMethod(cname: string, method: Kahve.Rest.Method): void {
		RestAppManager.app().addController(new Controller(cname, null, null)).getController(cname).addMethod(method);
	}

	/**
	 * Adds method argument to the method which is defined in the controller.
	 *
	 * @param cname controller name
	 * @param mname method name
	 * @param arg method argument definition
	 */
	public static addMethodArg(cname: string, mname: string, arg: Kahve.Rest.MethodArg): void {
		RestAppManager.app()
			.addController(new Controller(cname, null, null))
			.getController(cname)
			.addMethod(new Method(mname, null, null, null, null))
			.getMethod(mname)
			.addMethodArg(arg);
	}
}
