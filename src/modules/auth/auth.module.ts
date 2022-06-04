import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './auth.jwt.strategy'
import { UsersModule } from '../users/users.module'

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [UsersModule],
    exports: [AuthService],
})
export class AuthModule {}
