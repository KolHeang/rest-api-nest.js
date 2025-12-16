import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Permission } from '../permissions/permission.entity';
import { Role } from '../roles/roles.entity';
import { User } from '../users/users.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {

    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    try {
        // ========== 1. SEED PERMISSIONS ==========
        const permissionRepo = dataSource.getRepository(Permission);
        
        const permissionsData = [
            { name: 'users.create', description: 'បង្កើតអ្នកប្រើប្រាស់' },
            { name: 'users.read', description: 'មើលអ្នកប្រើប្រាស់' },
            { name: 'users.update', description: 'កែប្រែអ្នកប្រើប្រាស់' },
            { name: 'users.delete', description: 'លុបអ្នកប្រើប្រាស់' },
            { name: 'roles.create', description: 'បង្កើត Role' },
            { name: 'roles.read', description: 'មើល Role' },
            { name: 'roles.update', description: 'កែប្រែ Role' },
            { name: 'roles.delete', description: 'លុប Role' },
            { name: 'permissions.create', description: 'បង្កើត Permission' },
            { name: 'permissions.read', description: 'មើល Permission' },
            { name: 'permissions.update', description: 'កែប្រែ Permission' },
            { name: 'permissions.delete', description: 'លុប Permission' },
        ];

        for (const permData of permissionsData) {
            const exists = await permissionRepo.findOne({ where: { name: permData.name } });
            if (!exists) {
                await permissionRepo.save(permissionRepo.create(permData));
            }
        }

        const allPermissions = await permissionRepo.find();

        // ========== 2. SEED ROLES ==========
        const roleRepo = dataSource.getRepository(Role);

        // Admin - All permissions
        let adminRole = await roleRepo.findOne({ 
            where: { name: 'admin' },
            relations: ['permissions'] 
        });
        if (!adminRole) {
            adminRole = roleRepo.create({
                name: 'admin',
                description: 'Administrator - សិទ្ធិពេញលេញ',
                permissions: allPermissions,
            });
            await roleRepo.save(adminRole);
        }

        // ========== 3. SEED USERS ==========
        const userRepo = dataSource.getRepository(User);

        const usersData = [
            {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: 'admin123',
                roles: [adminRole],
            }
        ];

        for (const userData of usersData) {
            const exists = await userRepo.findOne({ where: { email: userData.email } });
            if (!exists) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = userRepo.create({
                    ...userData,
                    password: hashedPassword,
                });
                await userRepo.save(user);
            }
        }

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await app.close();
    }
}

    // Run seeder
    seed()
    .then(() => {
        console.log('Seed script finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed script failed:', error);
        process.exit(1);
    });