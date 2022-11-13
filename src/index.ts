import 'dotenv/config'
import App from './app'
import UserController from './api/user/user.controller'
import { Database } from './services/database'
import AuthController from './api/auth/auth.controller'

const db = new Database().getInstance()

const app = new App([new UserController(db), new AuthController(db)])

app.listen()
