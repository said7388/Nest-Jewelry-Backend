import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { redis } from 'src/redis';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  LoginAuthDto,
  PhoneNumberDto,
} from './dto/auth-model.dto';

@ApiTags('Authentication') // OpenAPI Folder title
@Controller('auth') // Root path for this controller
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

  // Get user profile by email
  @Get(':mail')
  @UseGuards(AuthGuard())
  getByMail(@Param('mail') email) {
    return this.authService.findUserByEmail(email);
  }

  // make a user as an admin
  @Patch('/admin')
  @UseGuards(AuthGuard())
  makeAdmin(@Req() req, @Body() body) {
    const { user } = req;
    if (user.role === 'admin') {
      return this.authService.makeUserToAdmin(body.email);
    }
    throw new UnauthorizedException('You have no permission to make admin.');
  }

  // confirm email verification link
  @Get('/confirm/:id')
  async confirm(@Param('id') id: string) {
    const userId = await redis.get(`confirmEmail:${id}`);
    if (!userId) {
      throw new NotFoundException('Your Varification Token is Expired.');
    }

    return this.authService.confirmEmailLink(userId);
  }

  // send a sms to user phone number
  @Post('phone')
  async phoneVerify(@Body() phone: PhoneNumberDto) {
    const { number } = phone;
    return this.authService.sendSms(number);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.authService.uploadImageToCloudinary(file);
  }
}
