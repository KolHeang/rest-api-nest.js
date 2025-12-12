import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RequireRoles } from 'src/auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    @RequirePermissions('roles.create')
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    @RequirePermissions('roles.read')
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @RequirePermissions('roles.read')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(+id);
    }

    @Patch(':id')
    @RequirePermissions('roles.update')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(+id, updateRoleDto);
    }

    @Delete(':id')
    @RequirePermissions('roles.update')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(+id);
    }

    @Post(':id/permissions')
    @RequirePermissions('roles.update')
    async assignPermissions(@Param('id') id: string, @Body() assignPermissionsDto: AssignPermissionsDto) {
        return this.rolesService.assignPermissions(+id, assignPermissionsDto);
    }

    @Delete(':id/permissions/:permissionId')
    @RequirePermissions('roles.update')
    async removePermission(@Param('id') roleId: string, @Param('permissionId') permissionId: string) {
        return this.rolesService.removePermission(+roleId, +permissionId);
    }

    @Post('seed')
    @RequireRoles('admin')
    async seed() {
        await this.rolesService.seedDefaultRoles();
        return { message: 'Default roles seeded successfully' };
    }
}
