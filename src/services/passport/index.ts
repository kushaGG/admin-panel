import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Db } from 'mongodb'
import UserService from '../../api/user/user.service'

class Passport {
	private userService: UserService
	constructor(private db: Db) {
		this.userService = new UserService(db)
		this.initStrategies()
	}

	private initStrategies() {
		passport.use(
			'userToken',
			new JwtStrategy(
				{
					secretOrKey: process.env.JWT_SECRET,
					jwtFromRequest: ExtractJwt.fromExtractors([
						ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
					]),
				},
				({ id }, done) =>
					this.userService
						.getById(id)
						.then((user) => {
							user && done(null, user)
							return null
						})
						.catch(done),
			),
		)

		passport.use(
			'userLocal',
			new LocalStrategy({ usernameField: 'username' }, async (email, password, done) => {
				const user = await this.userService.getOne({ username: email.toLowerCase() })

				if (!user) done({ success: false, message: 'Wrong username', field: 'username' }, false)
				else {
					if (user.role !== 'admin') done({ success: false, message: 'Expected only admin user' })

					const validPassword = await bcrypt.compare(password, user.password)
					if (!validPassword) {
						return done({ success: false, message: 'Wrong password', field: 'password' }, false)
					}

					return done(null, user)
				}
			}),
		)
	}

	userToken = () => (req: Request, res: Response, next: NextFunction) =>
		passport.authenticate('userToken', { session: false }, (err, user) => {
			if (err || !user) {
				return res.status(401).json({ success: false })
			}
			req.logIn(user, { session: false }, (err: Error) => {
				if (err) return res.status(401).json({ success: false })
				next()
			})
		})(req, res, next)

	password = () => (req: Request, res: Response, next: NextFunction) =>
		passport.authenticate('userLocal', { session: false }, (err, user) => {
			if (err && err.param) {
				return res.status(400).json(err)
			} else if (err || !user) {
				return res.status(403).json(err)
			}
			req.logIn(user, { session: false }, (err) => {
				if (err) return res.status(403).json(err)
				next()
			})
		})(req, res, next)
}

export default Passport
