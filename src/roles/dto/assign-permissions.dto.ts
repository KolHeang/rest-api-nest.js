import { ArrayMinSize, IsArray } from "class-validator";

export class AssignPermissionsDto {
    @IsArray()
    @ArrayMinSize(1)
    permissionIds: number[];
}