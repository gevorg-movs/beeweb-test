import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { User } from '../users/users.schema'
import { AuthLoginDto } from './dto/auth-login.dto'
import { generateFileRandomName } from '../../utils/files'
import { diskStorage } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './public/avatars',
                filename: generateFileRandomName,
            }),
        }),
    )
    async register(
        @Body() authRegisterDto: AuthRegisterDto,
        @UploadedFile() avatar: Express.Multer.File,
    ): Promise<User> {
        return await this.authService.register({ ...authRegisterDto, avatar })
    }

    @Post('/login')
    async login(@Body() authLoginDto: AuthLoginDto): Promise<User> {
        return await this.authService.login(authLoginDto)
    }
}
