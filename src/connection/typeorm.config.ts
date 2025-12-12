import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: config.get<string>('DATABASE_HOST'),
    port: parseInt(config.get<string>('DATABASE_PORT') ?? '5432'),
    username: config.get<string>('DATABASE_USER'),
    password: config.get<string>('DATABASE_PASSWORD'),
    database: config.get<string>('DATABASE_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],

    // Logging
    logging: config.get<string>('NODE_ENV') === 'development',

    // Connection pool
    extra: {
        max: 10,
        min: 2,
    },
});
