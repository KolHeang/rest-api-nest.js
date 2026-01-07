import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: config.get<string>('DATABASE_HOST'),
    port: parseInt(config.get<string>('DATABASE_PORT') ?? '5432', 10),
    username: config.get<string>('DATABASE_USER'),
    password: config.get<string>('DATABASE_PASSWORD'),
    database: config.get<string>('DATABASE_NAME'),

    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    
    synchronize: config.get('NODE_ENV') !== 'production' && config.get<boolean>('DATABASE_SYNCHRONIZE', false),

    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: config.get('NODE_ENV') === 'production',
    
    logging: config.get<string>('NODE_ENV') === 'development',
    
    extra: {
        max: 10,
        min: 2,
    },

});