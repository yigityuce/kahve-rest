import { Types } from 'kahve-core';
import { RestAppManager, DecoratorProcessor } from '../internals';
import * as express from 'express';
import * as cors from 'cors';

/**
 * Class annotation to define the class as a server.
 * - Automatically starts listening on specified port with **RestServerConfig** annotation or with default port "**8080**"
 *
 * @example
 * ```ts
 * @RestServer()
 * class MyServer {
 *   @RestServerConfig('PORT')
 *   private port: number = 9000;
 *
 *   @RestServerController()
 *   private myController = new MyController(); // should be the class annotated with "@RestController"
 * }
 * ```
 */
export function RestServer(): Types.ClassAnnotationReturnType {
	return function <T extends Types.Constructor>(ctor: T) {
		return class extends ctor {
			private app: express.Application;

			constructor(...args: any[]) {
				super(...args);
				Object.defineProperty(this.constructor, 'name', { value: ctor.name });
				this.initializeApp();
				RestAppManager.addServer(ctor.name, this);
				DecoratorProcessor.process(ctor.name, this.app);
			}

			private initializeApp(): void {
				this.app = express();
				this.app.use(express.json());
				this.app.use(express.urlencoded({ extended: true }));
				this.app.use(express.text());
				this.app.use(cors({ origin: '*' }));
			}
		};
	};
}
