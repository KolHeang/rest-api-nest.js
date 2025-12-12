import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const REQUIRE_ALL_KEY = 'requireAll';

export const RequirePermissions = (...permissions: string[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);

export const RequireAllPermissions = (...permissions: string[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions) &&
    SetMetadata(REQUIRE_ALL_KEY, true);
