import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Role } from '../roles/roles.entity';
import { Exclude } from 'class-transformer';
import { Employee } from 'src/employees/employee.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @ManyToMany(() => Role, role => role.users, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];

    @OneToOne(() => Employee, employee => employee.user, { eager: true, cascade: true , nullable: true })
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Helper methods
    hasRole(roleName: string): boolean {
        return this.roles?.some(role => role.name === roleName) || false;
    }

    hasPermission(permissionName: string): boolean {
        if (!this.roles) return false;
        
        return this.roles.some(role =>
            role.permissions?.some(permission => permission.name === permissionName)
        );
    }

    hasAnyPermission(permissionNames: string[]): boolean {
        return permissionNames.some(permission => this.hasPermission(permission));
    }

    hasAllPermissions(permissionNames: string[]): boolean {
        return permissionNames.every(permission => this.hasPermission(permission));
    }

    getAllPermissions(): string[] {
        if (!this.roles) return [];
        
        const permissions = new Set<string>();
        this.roles.forEach(role => {
            role.permissions?.forEach(permission => {
                permissions.add(permission.name);
            });
        });
        
        return Array.from(permissions);
    }
}