import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ObjectId } from 'mongodb'

enum UserSex {
	Male = 'male',
	Female = 'female',
	Other = 'other',
}

class User {
	constructor(
		public username: string,
		public password: string,
		public role: string,
		public sex: UserSex,
		public id?: ObjectId,
	) {}
}

class CreateUserDTO {
	@IsNotEmpty()
	@IsString()
	public username: string

	@IsNotEmpty()
	@IsString()
	public password: string

	@IsNotEmpty()
	@IsIn(Object.values(UserSex))
	@IsString()
	public sex: UserSex

	@IsNotEmpty()
	@IsString()
	public role: string
}

class UpdateUserDTO {
	@IsOptional()
	@IsString()
	public username?: string

	@IsOptional()
	@IsString()
	public password: string

	@IsOptional()
	@IsIn(Object.values(UserSex))
	@IsString()
	public sex: UserSex

	@IsOptional()
	@IsString()
	public role: string
}

export { CreateUserDTO, UpdateUserDTO }
export default User
