import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Get port from environment
    const port = configService.get<number>('PORT', 3000);
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');

    // Enable CORS
    const corsOrigins = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
    app.enableCors({
        origin: corsOrigins.split(','),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global Validation Pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw error if unknown properties
            transform: true, // Auto-transform payloads to DTO instances
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global Prefix
    app.setGlobalPrefix('api', {
        exclude: ['health'], // Exclude health check from api prefix
    });

    await app.listen(port);

    console.log(`Application is running on: http://localhost:${port}/api`);

    if (nodeEnv === 'development') {
        logger.warn('Development mode - synchronize is enabled!');
    }
}

bootstrap().catch((error) => {
    console.error('Application failed to start:', error);
    process.exit(1);
});
