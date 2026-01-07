import { Employee } from "src/employees/employee.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('positions')
export class Position {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 250, name: 'name_en' })
    nameEn: string;

    @Column({ type: 'varchar', length: 250, name: 'name_kh' })
    nameKh: string;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @OneToMany(() => Employee, employee => employee.position)
    employees: Employee[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}