import express, { Application } from 'express'
import errorMiddleware from './services/middlewares/error.middleware'
import Controller from './types/controller'
import { Database } from './services/database'

class App {
	public app: Application
	private database: Database

	constructor(controllers: Controller[]) {
		this.app = express()
		this.database = new Database()

		this.connectToDatabase()
		this.initializeMiddlewares()
		this.initializeControllers(controllers)
		this.initializeErrorHandling()
	}

	public listen() {
		this.app.listen(process.env.PORT, () => {
			console.log(`App listening on the port ${process.env.PORT}`)
		})
	}

	public getServer() {
		return this.app
	}

	private initializeMiddlewares() {
		this.app.use(express.json())
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware)
	}

	private initializeControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.app.use('/', controller.router)
		})
	}

	private connectToDatabase() {
		this.database.connect()
	}
}

export default App
