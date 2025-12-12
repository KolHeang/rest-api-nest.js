import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn } from 'typeorm';
import { Role } from '../roles/roles.entity';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; 

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];

    @CreateDateColumn()
    createdAt: Date;
}