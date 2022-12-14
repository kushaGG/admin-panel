import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDTO {
	@IsNotEmpty()
	@IsString()
	public username: string

	@IsNotEmpty()
	@IsString()
	public password: string
}
