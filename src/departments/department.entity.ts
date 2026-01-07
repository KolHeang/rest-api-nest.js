import { Employee } from "src/employees/employee.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('departments')
@Index(['parent'])
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    code: string;

    @Column({ length: 250, name: 'name_en' })
    nameEn: string;

    @Column({ length: 250, name: 'name_kh' })
    nameKh: string;

    @ManyToOne(() => Department, d => d.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent: Department;

    @OneToMany(() => Department, d => d.parent)
    children: Department[];

    @Column({ type: 'int', default: 1 })
    level: number;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @OneToMany(() => Employee, employee => employee.department)
    employees: Employee[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}