import UserService from '../user/user.service'
import { Db } from 'mongodb'
import HttpException from '../../services/exception'
import { sign } from 'jsonwebtoken'

class AuthService {
	private userService: UserService

	constructor(private db: Db) {
		this.userService = new UserService(db)
	}

	public async singIn(user: any) {
		if (!user) throw new HttpException(404, 'User not Found')

		const token = sign({ id: user._id }, process.env.JWT_SECRET!)

		return { token, user }
	}
}

export default AuthService
