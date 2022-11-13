import { Router, Request, Response, NextFunction } from 'express'

import Controller from '../../types/controller'
import UserService from './user.service'

import { success } from '../../services/responses'
import validationMiddleware from '../../services/middlewares/validation.middleware'
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto'
import { Db } from 'mongodb'
import Passport from '../../services/passport'

class UserController implements Controller {
	public path = '/users'
	public router = Router()
	private service: UserService
	private passport: Passport

	constructor(private db: Db) {
		this.service = new UserService(db)
		this.passport = new Passport(db)
		this.initializeRoutes()
	}

	private initializeRoutes() {
		this.router.post(
			this.path,
			this.passport.userToken(),
			validationMiddleware(CreateUserDTO),
			this.create,
		)
		this.router.get(this.path, this.passport.userToken(), this.getAll)
		this.router.get(`${this.path}/:id`, this.passport.userToken(), this.getById)
		this.router.put(
			`${this.path}/:id`,
			this.passport.userToken(),
			validationMiddleware(UpdateUserDTO),
			this.update,
		)
		this.router.delete(`${this.path}/:id`, this.passport.userToken(), this.destroy)
	}

	private create = ({ body }: Request, res: Response, next: NextFunction) =>
		this.service.create(body).then(success(res, 201)).catch(next)

	private getAll = (req: Request, res: Response, next: NextFunction) =>
		this.service.getAll().then(success(res, 200)).catch(next)

	private getById = ({ params }: Request, res: Response, next: NextFunction) =>
		this.service.getById(params.id).then(success(res, 200)).catch(next)

	private update = ({ body, params }: Request, res: Response, next: NextFunction) =>
		this.service.update(params.id, body).then(success(res, 200)).catch(next)

	private destroy = ({ params }: Request, res: Response, next: NextFunction) =>
		this.service.destroy(params.id).then(success(res, 204)).catch(next)
}

export default UserController
