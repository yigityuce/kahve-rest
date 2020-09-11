import { Types } from 'kahve-core';
import { RestAppManager, DecoratorProcessor } from '../internals';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';

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
			constructor(...args: any[]) {
				super(...args);
				Object.defineProperty(this.constructor, 'name', { value: ctor.name });
				RestAppManager.addServer(ctor.name, this);
				DecoratorProcessor.process(ctor.name, this.initializeApp());
			}

			private initializeApp(): express.Application {
				return express()
					.use(express.json())
					.use(express.urlencoded({ extended: true }))
					.use(express.text())
					.use(cors({ origin: '*' }))
					.use(helmet.hidePoweredBy())
					.use(helmet.noSniff());
			}
		};
	};
}
