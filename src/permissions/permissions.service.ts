import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ){}
    
    async create(createPermissionDto: CreatePermissionDto) {
        const existing = await this.permissionRepository.findOne({
        where: { name: createPermissionDto.name },
        });

        if (existing) {
        throw new ConflictException(`Permission "${createPermissionDto.name}" មានរួចហើយ`);
        }

        const permission = this.permissionRepository.create(createPermissionDto);
        return await this.permissionRepository.save(permission);
    }

    async findAll() {
        return await this.permissionRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number) {
        const permission = await this.permissionRepository.findOne({
            where: { id },
            relations: ['roles'],
        });

        if (!permission) {
            throw new NotFoundException(`រកមិនឃើញ Permission លេខ ${id}`);
        }

        return permission;
    }

    async findByName(name: string) {
        return await this.permissionRepository.findOne({ where: { name } });
    }

    async findByIds(ids: number[]): Promise<Permission[]> {
        return await this.permissionRepository.find({
            where: { id: In(ids) },
        });
    }

    async update(id: number, updatePermissionDto: Partial<UpdatePermissionDto>) {
        await this.permissionRepository.update(id, updatePermissionDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const result = await this.permissionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`រកមិនឃើញ Permission លេខ ${id}`);
        }

        return result;
    }
}
