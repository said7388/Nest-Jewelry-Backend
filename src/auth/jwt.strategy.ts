import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'thisIsmySecret',
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const result = user[0];
    return {
      email: result.email,
      id: result._id,
      role: result.role,
    };
  }
}
