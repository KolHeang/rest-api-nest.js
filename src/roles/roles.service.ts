import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { In, Repository } from 'typeorm';
import { Permission } from '../permissions/permission.entity';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private roleRepository: Repository<Role>,
		@InjectRepository(Permission)
		private permissionRepository: Repository<Permission>
	){}

	async create(createRoleDto: CreateRoleDto): Promise<Role> {
		const existing = await this.roleRepository.findOne({
			where: { name: createRoleDto.name },
		});

		if (existing) {
			throw new ConflictException(`Role "${createRoleDto.name}" មានរួចហើយ`);
		}

		const role = this.roleRepository.create({
			name: createRoleDto.name,
			description: createRoleDto.description,
		});

		if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
			role.permissions = await this.permissionRepository.find({
				where: { id: In(createRoleDto.permissionIds) },
			});
		}

		return await this.roleRepository.save(role);
	}

	async findAll(): Promise<Role[]> {
		return await this.roleRepository.find({
			relations: ['permissions'],
			order: { name: 'ASC' },
		});
	}

	async findOne(id: number) {
		const role = await this.roleRepository.findOne({
			where: { id },
			relations: ['permissions', 'users'],
		});

		if (!role) {
			throw new NotFoundException(`រកមិនឃើញ Role លេខ ${id}`);
		}

		return role;
	}

	async findByName(name: string) {
		return await this.roleRepository.findOne({
			where: { name },
			relations: ['permissions'],
		});
	}

	async findByIds(ids: number[]): Promise<Role[]> {
		return await this.roleRepository.find({
			where: { id: In(ids) },
			relations: ['permissions'],
		});
	}

	async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
		const role = await this.findOne(id);

		role.name = updateRoleDto.name ?? role.name;
		role.description = updateRoleDto.description ?? role.description;

		if (updateRoleDto.permissionIds) {
			role.permissions = await this.permissionRepository.find({
				where: { id: In(updateRoleDto.permissionIds) },
			});
		}

		return await this.roleRepository.save(role);
	}

	async assignPermissions(id: number, assignPermissionsDto: AssignPermissionsDto): Promise<Role> {
		const role = await this.findOne(id);
		const permissions = await this.permissionRepository.find({
			where: { id: In(assignPermissionsDto.permissionIds) },
		});

		role.permissions = permissions;
		return await this.roleRepository.save(role);
	}

	async removePermission(roleId: number, permissionId: number): Promise<Role> {
		const role = await this.findOne(roleId);
		role.permissions = role.permissions.filter(p => p.id !== permissionId);
		return await this.roleRepository.save(role);
	}

	async remove(id: number): Promise<void> {
		const role = await this.findOne(id);
		
		if (role.users && role.users.length > 0) {
			throw new ConflictException(`មិនអាចលុប Role នេះបានទេ ព្រោះមានអ្នកប្រើប្រាស់ ${role.users.length} នាក់កំពុងប្រើ`);
		}

		await this.roleRepository.remove(role);
	}

	async seedDefaultRoles(): Promise<void> {
		const allPermissions = await this.permissionRepository.find();
		
		const userPermissions = allPermissions.filter(p => 
			p.name === 'posts.read' || p.name === 'users.read'
		);
		
		const moderatorPermissions = allPermissions.filter(p => 
			p.name.startsWith('posts.') || p.name === 'users.read'
		);

		const defaultRoles = [
			{
				name: 'admin',
				description: 'Administrator - សិទ្ធិពេញលេញទាំងអស់',
				permissions: allPermissions,
			},
			{
				name: 'moderator',
				description: 'Moderator - គ្រប់គ្រងមាតិកា',
				permissions: moderatorPermissions,
			},
			{
				name: 'user',
				description: 'Regular User - អ្នកប្រើប្រាស់ធម្មតា',
				permissions: userPermissions,
			},
		];

		for (const roleData of defaultRoles) {
			const exists = await this.findByName(roleData.name);
			if (!exists) {
				const role = this.roleRepository.create(roleData);
				await this.roleRepository.save(role);
			}
		}
	}
}
