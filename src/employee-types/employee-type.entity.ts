import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Employee } from '../employees/employee.entity';

@Entity('employee_types')
export class EmployeeType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 250, name: 'name_en' })
    nameEn: string;

    @Column({ type: 'varchar', length: 250, name: 'name_kh' })
    nameKh: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => Employee, emp => emp.employeeType)
    employees: Employee[];

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}