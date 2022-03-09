import { Router, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IRouteComtroller } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		// this.logger = logger
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): Response<any, Record<string, any>> {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
		// res.type('application/json')
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): void {
		this.send<T>(res, 200, message);
	}

	protected createBaseCrud(service): void {
		// Code...
		console.log(service);
	}

	protected bindRoutes(routes: IRouteComtroller[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const handler = route.func.bind(this);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const pipeline = middleware ? [...middleware, handler] : handler;
			this._router[route.method](route.path, pipeline);
		}
	}
}
