import { Controller } from './Controller';
import { Server } from './Server';
import { UniqueList } from '../../../internals';

/**
 * Rest application type which will be stored in the global variable.
 * @internal
 */
export class App {
	private controllers: UniqueList<Controller> = new UniqueList<Controller>('name');
	private servers: UniqueList<Server> = new UniqueList<Server>('name');

	/**
	 * Retrieves controller with name.
	 *
	 * @param name controller name to be retrieved
	 */
	public getController(name: string): Controller {
		return this.controllers.get(name);
	}

	/**
	 * Get all controllers defined as a list.
	 */
	public getControllers(): Controller[] {
		return this.controllers.getAll();
	}

	/**
	 * Adds controller to the list if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param c controller
	 */
	public addController(c: Controller): this {
		this.controllers.add(c);
		return this;
	}

	/**
	 * Retrieves server with name.
	 *
	 * @param name server name to be retrieved
	 */
	public getServer(name: string): Server {
		return this.servers.get(name);
	}

	/**
	 * Get all server defined as a list.
	 */
	public getServers(): Server[] {
		return this.servers.getAll();
	}

	/**
	 * Adds server to the list if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param s server
	 */
	public addServer(s: Server): this {
		this.servers.add(s);
		return this;
	}
}
