import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WorkspacesModule } from './modules/workspaces/workspaces.module'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './modules/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { ProfileModule } from './modules/profile/profile.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ChannelsModule } from './modules/channels/channels.module'
import { CoreModule } from './core.module'

const config = ConfigModule.forRoot({
    envFilePath: '.env',
})

const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD
const mongoCluster = process.env.MONGO_CLUSTER
const mongoDb = process.env.MONGO_DB
const mongoPort = process.env.MONGO_PORT

const mongoUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoCluster}:${mongoPort}`

@Module({
    imports: [
        config,
        CoreModule,
        MongooseModule.forRoot(mongoUri, {
            dbName: mongoDb,
        }),
        AuthModule,
        WorkspacesModule,
        ChannelsModule,
        UsersModule,
        ProfileModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            serveRoot: '/public/',
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
