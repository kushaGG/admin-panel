import request from 'supertest'
import { Database } from '../../services/database'
import App from '../../app'
import UserController from '../user/user.controller'
import AuthController from './auth.controller'

const db = new Database().getInstance()

const app = new App([new UserController(db), new AuthController(db)]).getServer()

describe('Auth', () => {
	test('POST /auth 403 (wrong username)', async () => {
		const { body } = await request(app)
			.post(`/auth`)
			.send({
				username: 'test',
				password: 'secretpassword',
			})
			.expect(403)

		expect(body.success).toBeFalsy()
		expect(body.field).toBe('username')
	})

	test('POST /auth 403 (wrong password)', async () => {
		const { body } = await request(app)
			.post(`/auth`)
			.send({
				username: 'admin',
				password: 'password',
			})
			.expect(403)

		expect(body.success).toBeFalsy()
		expect(body.field).toBe('password')
	})

	test('POST /auth 201', async () => {
		const { body } = await request(app)
			.post(`/auth`)
			.send({
				username: 'admin',
				password: 'secretpassword',
			})
			.expect(201)

		expect(body.success).toBeTruthy()
		expect(body.data.user.username).toBe('admin')
	})
})
