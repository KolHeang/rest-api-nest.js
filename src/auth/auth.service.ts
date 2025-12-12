import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/roles.entity";
import { User } from "src/users/users.entity";
import { In, Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private jwtService: JwtService,
    ){}

    async register(registerDto: RegisterDto): Promise<{ user: User, access_token: string }> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email }
        });

        if (existingUser) {
            throw new ConflictException('អ៊ីមែលនេះមានរួចហើយ');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = this.usersRepository.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
        });

        if (registerDto.roleIds && registerDto.roleIds.length > 0) {
            user.roles = await this.roleRepository.find({
                where: { id: In(registerDto.roleIds) },
                relations: ['permissions'],
            });
        } else {
            const defaultRole = await this.roleRepository.findOne({
                where: { name: 'user' },
                relations: ['permissions'],
            });
            if (defaultRole) {
                user.roles = [defaultRole];
        }
        }

        await this.usersRepository.save(user);

        const access_token = await this.generateToken(user);

        return { user, access_token };
    }

    async login(loginDto: LoginDto): Promise<{ user: User; access_token: string }> {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email },
            relations: ['roles', 'roles.permissions'],
        });

        if (!user) {
            throw new UnauthorizedException('អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('គណនីត្រូវបានបិទ');
        }

        // ✅ Remove password safely
        const { password, ...userWithoutPassword } = user;
        const access_token = await this.generateToken(user);

        return { user: user, access_token };
    }

    private async generateToken(user: User): Promise<string> {
        const roles = user.roles?.map(role => role.name) || [];
        const permissions = user.getAllPermissions();

        const payload = {
        sub: user.id,
        email: user.email,
        roles: roles,
        permissions: permissions,
        };

        return this.jwtService.sign(payload);
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['roles', 'roles.permissions'],
        });
    }

    async validateUser(userId: number): Promise<User> {
        const user = await this.findById(userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedException();
        }

        return user;
    }
}