import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import HttpException from '../exception'

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) => {
		validate(plainToInstance(type, req.body), { skipMissingProperties }).then(
			(errors: ValidationError[]) => {
				if (errors.length > 0) {
					const message = errors
						.map((error: ValidationError) => error.constraints && Object.values(error.constraints))
						.join(', ')
					next(new HttpException(400, message))
				} else {
					next()
				}
			},
		)
	}
}

export default validationMiddleware
