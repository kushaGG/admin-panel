import 'dotenv/config'
import App from './app'
import UserController from './api/user/user.controller'
import { Database } from './services/database'

const db = new Database().getInstance()

const app = new App([new UserController(db)])

app.listen()
