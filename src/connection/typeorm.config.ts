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
    
    // Auto-create tables from entities — ONLY in development
    synchronize: config.get<boolean>('DATABASE_SYNCHRONIZE', false),
    
    // Auto-run pending migrations on app startup (safe alternative to synchronize)
    migrationsRun: config.get<boolean>('DATABASE_MIGRATIONS_RUN', false),
    
    // List of migration files
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    
    // Enable query logging in development
    logging: config.get<string>('NODE_ENV') === 'development',
    
    // Connection pool
    extra: {
        max: 10,
        min: 2,
    },
});