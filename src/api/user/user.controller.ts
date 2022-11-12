import { Router, Request, Response, NextFunction } from 'express'

import Controller from '../../types/controller'
import UserService from './user.service'

import { success } from '../../services/responses'
import validationMiddleware from '../../services/middlewares/validation.middleware'
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto'
import { Db } from 'mongodb'

class UserController implements Controller {
	public path = '/users'
	public router = Router()
	private service: UserService

	constructor(private db: Db) {
		this.service = new UserService(db)
		this.initializeRoutes()
	}

	private initializeRoutes() {
		this.router.post(this.path, validationMiddleware(CreateUserDTO), this.create)
		this.router.get(this.path, this.getAll)
		this.router.get(`${this.path}/:id`, this.getById)
		this.router.put(`${this.path}/:id`, validationMiddleware(UpdateUserDTO), this.update)
		this.router.delete(`${this.path}/:id`, this.destroy)
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
