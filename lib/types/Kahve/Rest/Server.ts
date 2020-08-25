import { ServerController } from './ServerController';
import { RestAppManager, UniqueList } from '../../../internals';
import { ServerConfig, RestServerConfigTypes } from './ServerConfig';
import { ServerLifecycleMethod, ServerLifecylceMethodType } from './ServerLifecycleMethod';

/**
 * Server type which will be stored in the application instance.
 *
 * @internal
 */
export class Server {
	private id: number = RestAppManager.AUTO_INCREMENT_ID++;
	private controllers: UniqueList<ServerController> = new UniqueList<ServerController>('name');
	private configs: UniqueList<ServerConfig> = new UniqueList<ServerConfig>('name');
	private lifecycleMethods: UniqueList<ServerLifecycleMethod> = new UniqueList<ServerLifecycleMethod>('type');

	constructor(public name: string, public instance: any) {}

	/**
	 * Retrieves controller with name.
	 *
	 * @param name controller name to be retrieved
	 */
	public getController(name: string): ServerController {
		return this.controllers.get(name);
	}

	/**
	 * Get all controllers defined as a list.
	 */
	public getControllers(): ServerController[] {
		return this.controllers.getAll();
	}

	/**
	 * Adds controller to the list if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param c controller
	 */
	public addController(c: ServerController): this {
		this.controllers.add(c);
		return this;
	}

	/**
	 * Retrieves lifecycle method with type.
	 *
	 * @param type lifecycle method type to be retrieved
	 */
	public getLifecycleMethodByType(type: ServerLifecylceMethodType): ServerLifecycleMethod {
		return this.lifecycleMethods.get(type);
	}

	/**
	 * Retrieves lifecycle method with name.
	 *
	 * @param name lifecycle method name to be retrieved
	 */
	public getLifecycleMethodByName(name: string): ServerLifecycleMethod {
		const lifecycleMethods = this.lifecycleMethods.getAll();
		return lifecycleMethods.find(c => c.name === name);
	}

	/**
	 * Get all lifecycle methods defined as a list.
	 */
	public getLifecycleMethods(): ServerLifecycleMethod[] {
		return this.lifecycleMethods.getAll();
	}

	/**
	 * Adds lifecycle method to the list if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param m lifecycle method
	 */
	public addLifecycleMethod(m: ServerLifecycleMethod): this {
		this.lifecycleMethods.add(m);
		return this;
	}

	/**
	 * Retrieves config with name.
	 *
	 * @param name config name to be retrieved
	 */
	public getConfigByName(name: string): ServerConfig {
		return this.configs.get(name);
	}

	/**
	 * Retrieves config with key.
	 *
	 * @param key config key to be retrieved
	 */
	public getConfigByKey(key: RestServerConfigTypes): ServerConfig {
		const configs = this.configs.getAll();
		return configs.find(c => c.key === key || this.getDefaultConfigs()[key]);
	}

	/**
	 * Get all configs defined as a list.
	 */
	public getConfigs(): ServerConfig[] {
		return this.configs.getAll();
	}

	/**
	 * Adds config to the list if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param c config
	 */
	public addConfig(c: ServerConfig): this {
		this.configs.add(c);
		return this;
	}

	private getDefaultConfigs(): ServerConfig[] {
		return [new ServerConfig('PORT', null, 8080), new ServerConfig('TEST', null, 'Developed for developers')];
	}
}
