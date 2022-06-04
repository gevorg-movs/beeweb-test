import { Model, ObjectId } from 'mongoose'
import { HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { User, UserDocument } from '../users/users.schema'
import * as bcrypt from 'bcrypt'
import { AuthLoginDto } from './dto/auth-login.dto'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async register(registerDto: AuthRegisterDto): Promise<any> {
        const userWithEmail = await this.userModel.findOne({
            email: registerDto.email,
        })

        if (userWithEmail) {
            throw new HttpException(
                {
                    message: 'Email already in use',
                },
                400,
            )
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 10)

        const userData: User = {
            email: registerDto.email,
            password: passwordHash,
        }

        if (registerDto.avatar) {
            userData.avatar = registerDto.avatar.path
        }

        const user = await this.userModel.create(userData)

        const accessToken = this.createToken(user)

        return {
            user: {
                email: user.email,
                avatar: user.avatar,
            },
            accessToken,
        }
    }

    async login(loginDto: AuthLoginDto): Promise<any> {
        const user = await this.userModel.findOne({
            email: loginDto.email,
        })

        if (!user) {
            throw new HttpException(
                {
                    message: 'User not found',
                },
                400,
            )
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password)

        if (!isMatch) {
            throw new HttpException(
                {
                    message: 'Invalid password',
                },
                400,
            )
        }

        const accessToken = this.createToken(user)

        return {
            user: {
                email: user.email,
                avatar: user.avatar,
            },
            accessToken,
        }
    }

    createToken(user: UserDocument): string {
        return this.jwtService.sign({ _id: user._id })
    }

    async validateUser(userId: ObjectId): Promise<User> {
        return this.usersService.getUserByID(userId)
    }
}
