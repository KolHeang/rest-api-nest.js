import { IsArray, ArrayMinSize } from 'class-validator';

export class AssignRolesDto {
    @IsArray()
    @ArrayMinSize(1)
    roleIds: number[];
}