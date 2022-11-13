import App from '../../app'
import UserController from './user.controller'
import AuthController from '../auth/auth.controller'
import { Database } from '../../services/database'
import request from 'supertest'
import User from './dto/user.dto'

const db = new Database().getInstance()

const app = new App([new UserController(db), new AuthController(db)]).getServer()

let token: string, admin: User, usersCount: number, testUserId: string

describe('User', () => {
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

		token = body.data.token
		admin = body.data.user
	})

	test('GET /users 401 (unauthorized error)', async () => {
		const { body } = await request(app).get('/users').expect(401)

		expect(body.success).toBeFalsy()
	})

	test('GET /users 200', async () => {
		const { body } = await request(app)
			.get('/users')
			.set({ Authorization: `Bearer ${token}` })
			.expect(200)

		expect(body.success).toBeTruthy()
		expect(body.data).toEqual(expect.arrayContaining([admin]))

		usersCount = body.data.length
	})

	test('POST /users 201', async () => {
		const { body } = await request(app)
			.post('/users')
			.set({ Authorization: `Bearer ${token}` })
			.send({
				username: 'test',
				password: 'password',
				role: 'user',
				sex: 'male',
			})
			.expect(201)

		const { success, data } = body

		expect(success).toBeTruthy()
		expect(data).toEqual(expect.objectContaining({ username: 'test' }))

		testUserId = data._id
	})

	test('GET /users 200 (new user defined)', async () => {
		const { body } = await request(app)
			.get('/users')
			.set({ Authorization: `Bearer ${token}` })
			.expect(200)

		const { success, data } = body

		expect(success).toBeTruthy()
		expect(data).toEqual(expect.arrayContaining([expect.objectContaining({ username: 'test' })]))
		expect(data.length).toBe(usersCount + 1)
	})

	test('PUT /users/:id 202', async () => {
		const { body } = await request(app)
			.put(`/users/${testUserId}`)
			.send({
				username: 'testtest',
			})
			.set({ Authorization: `Bearer ${token}` })
			.expect(202)

		const { success, data } = body

		expect(success).toBeTruthy()
		expect(data).toEqual(expect.objectContaining({ username: 'testtest' }))
	})

	test('DELETE /users 204', async () => {
		await request(app)
			.delete(`/users/${testUserId}`)
			.set({ Authorization: `Bearer ${token}` })
			.expect(204)
	})
})
