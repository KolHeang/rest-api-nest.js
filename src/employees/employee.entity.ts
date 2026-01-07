import { use } from "passport";
import { Department } from "src/departments/department.entity";
import { EmployeeType } from "src/employee-types/employee-type.entity";
import { Position } from "src/positions/position.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, unique: true, name: 'employee_code' })
    employeeCode: string;

    @Column({ type: "varchar", length: 200, name: 'full_name_en', unique: true })
    fullNameEn: string;

    @Column({ type: "varchar", length: 200, name: 'full_name_kh' })
    fullNameKh: string;

    @Column({ enum: ['male', 'female', 'other'], type: 'enum', default: 'male' })
    gender: string;

    @Column({ type: 'date', nullable: true })
    dob: Date;

    @Column({ nullable: true, length: 25, unique: true })
    phone: string;

    @Column({ nullable: true, length: 100, unique: true })
    email: string;

    @Column({ type: 'date' , nullable: true, name: 'hire_date' })
    hireDate: Date;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @ManyToOne(() => Department, department => department.employees)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => Position, position => position.employees)
    @JoinColumn({ name: 'position_id' })
    position: Position;

    @ManyToOne(() => EmployeeType, employeeType => employeeType.employees)
    @JoinColumn({ name: 'employee_type_id' })
    employeeType: EmployeeType;

    @OneToOne(() => User, user => user.employee)
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}