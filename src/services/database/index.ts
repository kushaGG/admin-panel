import { Db, MongoClient } from 'mongodb'
import 'dotenv/config'

export class Database {
	private client: MongoClient

	constructor() {
		this.client = new MongoClient(process.env.DATABASE_URI!)
	}

	public connect(): void {
		this.client.connect().then()
	}

	public getInstance(): Db {
		return this.client.db(process.env.DATABASE_NAME)
	}
}
