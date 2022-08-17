import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto } from './dto/auth-model.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createNewUser(createAuthDto);
  }

  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.loginUser(loginAuthDto);
  }

  @Get(':mail')
  @UseGuards(AuthGuard())
  getByMail(@Param('mail') email) {
    return this.authService.findUserByEmail(email);
  }

  @Patch('/admin')
  @UseGuards(AuthGuard())
  makeAdmin(@Req() req, @Body() body) {
    const { user } = req;
    if (user.role === 'admin') {
      return this.authService.makeUserToAdmin(body.email);
    }
    throw new UnauthorizedException('You have no permission to make admin.');
  }
}
