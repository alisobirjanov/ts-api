import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IExeptionFilter } from './exeption.filte.interface';
import { HTTPError } from './http-error.class';
import 'reflect-metadata';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		console.log(err);
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).json({ err: err.message });
		} else {
			this.logger.error(`Error: ${err.message}`);
			res.status(500).json({ err: err.message });
		}
	}
}
