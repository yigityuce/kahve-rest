import * as express from 'express';
import * as cors from 'cors';
import { DecoratorProcessor } from './internals';

export abstract class RestApp {
	private readonly controllers: any[];
	private readonly app: express.Application;

	constructor(...controllers: any[]) {
		this.controllers = controllers;
		this.app = express();
		this.initializeApp();
	}

	protected listen(port: number): void {
		new DecoratorProcessor(this.app).process();
		this.app.listen(port, () => this.onStart());
	}

	private initializeApp(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.text());
		this.app.use(cors({ origin: '*' }));
	}

	protected abstract onStart(): void;
}
