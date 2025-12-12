import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { In, Repository } from 'typeorm';
import { Role } from '../roles/roles.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async findAll(): Promise<User[]> {
        const users = await this.usersRepository.find({
            relations: ['roles', 'roles.permissions'],
        });

        return users;
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['roles', 'roles.permissions'],
        });

        if (!user) {
            throw new NotFoundException(`រកមិនឃើញអ្នកប្រើប្រាស់លេខ ${id}`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['roles'],
        });

        if (!user) {
            throw new NotFoundException(`រកមិនឃើញអ្នកប្រើប្រាស់លេខ ${id}`);
        }

        if (updateUserDto.name) user.name = updateUserDto.name;
        if (updateUserDto.email) user.email = updateUserDto.email;

        if (updateUserDto.roleIds) {
            user.roles = await this.roleRepository.find({
                where: { id: In(updateUserDto.roleIds) },
            });
        }

        await this.usersRepository.save(user);
        return user;
    }

    async remove(id: number): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
        throw new NotFoundException(`រកមិនឃើញអ្នកប្រើប្រាស់លេខ ${id}`);
        }
    }

    async assignRoles(userId: number, roleIds: number[]): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['roles'],
        });

        console.log('user',user)

        if (!user) {
            throw new NotFoundException(`រកមិនឃើញអ្នកប្រើប្រាស់លេខ ${userId}`);
        }

        const roles = await this.roleRepository.find({
            where: { id: In(roleIds) },
        });

        if (roles.length !== roleIds.length) {
            throw new NotFoundException('មាន Role មួយចំនួនរកមិនឃើញ');
        }

        user.roles = roles;
        await this.usersRepository.save(user);
        return user;
    }

    async getUserPermissions(userId: number): Promise<{
        user: User;
        roles: string[];
        permissions: string[];
    }> {
        const user = await this.findOne(userId);
        
        return {
            user,
            roles: user.roles.map(role => role.name),
            permissions: user.getAllPermissions(),
        };
    }

    async deactivate(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`រកមិនឃើញអ្នកប្រើប្រាស់លេខ ${id}`);
        }
        
        user.isActive = false;
        await this.usersRepository.save(user);
        return user;
    }

    async activate(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`រកមិនឃើញអ្នកប្រើប្រាស់លេខ ${id}`);
        }
        
        user.isActive = true;
        await this.usersRepository.save(user);
        return user;
    }
}
