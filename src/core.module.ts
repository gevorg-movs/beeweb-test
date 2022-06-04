import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './modules/auth/contants'

@Module({
    imports: [
        {
            ...JwtModule.register({
                secret: jwtConstants.secret,
                signOptions: { expiresIn: jwtConstants.expiresIn },
            }),
            global: true,
        },
    ],
    exports: [JwtModule],
})
export class CoreModule {}
