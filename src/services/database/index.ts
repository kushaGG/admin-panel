import { Db, MongoClient } from 'mongodb'

export class Database {
	private client: MongoClient

	constructor() {
		this.client = new MongoClient(process.env.DATABASE_URI!)
	}

	public connect(): void {
		this.client.connect().then(() => console.log('Success connect to DB'))
	}

	public getInstance(): Db {
		return this.client.db(process.env.DATABASE_NAME)
	}
}
