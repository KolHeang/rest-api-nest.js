import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('users.read')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermissions('users.read')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @RequirePermissions('users.update')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions('users.delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post(':id/roles')
  @RequirePermissions('users.update')
  async assignRoles(@Param('id') id: string, @Body() assignRolesDto: AssignRolesDto) {
    return this.usersService.assignRoles(+id, assignRolesDto.roleIds);
  }

  @Get(':id/permissions')
  @RequirePermissions('users.read')
  async getUserPermissions(@Param('id') id: string) {
    return this.usersService.getUserPermissions(+id);
  }

  @Put(':id/deactivate')
  @RequirePermissions('users.update')
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(+id);
  }

  @Put(':id/activate')
  @RequirePermissions('users.update')
  async activate(@Param('id') id: string) {
    return this.usersService.activate(+id);
  }
}
