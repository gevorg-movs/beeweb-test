import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter'
import { useContainer } from 'class-validator'

const port = process.env.PORT || 5000

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
        }),
    )
    const { httpAdapter } = app.get(HttpAdapterHost)
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

    useContainer(app.select(AppModule), { fallbackOnErrors: true })

    app.enableCors()

    await app.listen(port)
}

bootstrap().then(() => {
    console.log(`===============================================`)
    console.log(`      Server has been started on port ${port}`)
    console.log(`===============================================`)
})
