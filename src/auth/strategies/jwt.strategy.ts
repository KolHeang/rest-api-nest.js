import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { User } from 'src/users/users.entity';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
    sub: number;
    email: string;
    roles: string[];
    permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret'),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.authService.validateUser(payload.sub);
        
        if (!user) {
        throw new UnauthorizedException('អ្នកប្រើប្រាស់មិនត្រឹមត្រូវ');
        }
        
        return user; // This will be attached to request.user
    }
}