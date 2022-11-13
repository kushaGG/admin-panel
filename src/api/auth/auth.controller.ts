import AuthService from './auth.service'
import { Db } from 'mongodb'
import { NextFunction, Request, Response, Router } from 'express'
import Passport from '../../services/passport'
import validationMiddleware from '../../services/middlewares/validation.middleware'
import { success } from '../../services/responses'
import { LoginDTO } from './dto/auth.dto'

class AuthController {
	public path = '/auth'
	public router = Router()
	private passport: Passport
	private authService: AuthService

	constructor(private db: Db) {
		this.authService = new AuthService(db)
		this.passport = new Passport(db)
		this.initializeRoutes()
	}

	private initializeRoutes() {
		this.router.post(
			this.path,
			validationMiddleware(LoginDTO),
			this.passport.password(),
			this.signIn,
		)
	}

	private signIn = (req: Request, res: Response, next: NextFunction) =>
		this.authService.singIn(req.user).then(success(res, 201)).catch(next)
}

export default AuthController
