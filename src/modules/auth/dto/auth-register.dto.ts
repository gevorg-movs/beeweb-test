import { IsEmail, IsString } from 'class-validator'

export class AuthRegisterDto {
    @IsEmail()
    email: string

    @IsString()
    password: string

    @IsString()
    passwordConfirmation: string

    avatar?: Express.Multer.File
}
