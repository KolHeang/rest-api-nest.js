import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './connection/typeorm.config';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
    imports: [
        // Environment Variables
        ConfigModule.forRoot({ 
            isGlobal: true,
            envFilePath: '.env', // ឬ 'env' ប្រសិនបើ file របស់អ្នកឈ្មោះ "env"
            cache: true, // Cache env variables for better performance
        }),

        // Database Configuration
            TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => typeOrmConfig(config)
        }),
        
        RolesModule,
        PermissionsModule,
        UsersModule,
        AuthModule
    ],

    // Global Guards
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ]
})
export class AppModule {}
