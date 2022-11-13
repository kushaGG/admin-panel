import { Collection, Db, Filter, ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

import User, { CreateUserDTO, UpdateUserDTO } from './dto/user.dto'
import HttpException from '../../services/exception'

export default class UserService {
	private userCollection: Collection<User>

	constructor(private db: Db) {
		this.userCollection = db.collection<User>('user')
	}

	public async create(body: CreateUserDTO): Promise<User | null> {
		const hash = await bcrypt.hash(body.password, 10)

		const { insertedId } = await this.userCollection.insertOne({ ...body, password: hash })
		return this.userCollection.findOne({ _id: insertedId })
	}

	public async getAll(): Promise<Array<User>> {
		return this.userCollection.find().toArray()
	}

	public async getById(id: string): Promise<User | null> {
		const filter = { _id: new ObjectId(id) }

		return this.userCollection.findOne(filter)
	}

	public async getOne(filter: Filter<User>) {
		return this.userCollection.findOne(filter)
	}

	public async update(id: string, body: UpdateUserDTO): Promise<User | null> {
		const filter = { _id: new ObjectId(id) }
		const update = { $set: body }

		const result = await this.userCollection.updateOne(filter, update)
		if (!result.matchedCount) throw new HttpException(404, 'User not Found')

		return this.userCollection.findOne(filter)
	}

	public async destroy(id: string): Promise<void> {
		const filter = { _id: new ObjectId(id) }

		const result = await this.userCollection.deleteOne(filter)
		if (!result.deletedCount) throw new HttpException(404, 'User not Found')

		return
	}
}
