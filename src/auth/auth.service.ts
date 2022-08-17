import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bycript from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateAuthDto, LoginAuthDto } from './dto/auth-model.dto';
import { AuthModel } from './entities/auth.entity';
import { getProfile } from './helper/profile';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private readonly authModel: Model<AuthModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createNewUser(createAuthDto: CreateAuthDto) {
    const { firstName, lastName, email, password } = createAuthDto;
    const salt = await bycript.genSalt();
    const hashPassword = await bycript.hash(password, salt);
    const newUser = new this.authModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
      salt,
      role: 'user',
    });
    const existingUser = await this.findUserByEmail(email);
    if (existingUser.length > 0) {
      throw new ConflictException('This email alrady taken!');
    }
    const result = await newUser.save();
    const profile = getProfile(result);
    const accessToken = await this.jwtService.sign(profile);
    return { profile, accessToken };
  }

  async loginUser(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const existingUser = await this.findUserByEmail(email);
    if (existingUser.length < 1) {
      throw new ConflictException('User does not exist!');
    }
    const user = existingUser[0];
    const salt = user.salt;
    const hashPassword = await bycript.hash(password, salt);
    const db_password = user.password;
    if (!(hashPassword === db_password)) {
      throw new BadRequestException('Password does not match!');
    }
    const profile = getProfile(user);
    const accessToken = await this.jwtService.sign(profile);
    return {
      message: 'User Login Successfully!',
      profile,
      accessToken,
    };
  }

  async makeUserToAdmin(email: string) {
    const result = await this.authModel.updateOne(
      { email: email },
      { $set: { role: 'admin' } },
    );

    if (!result.matchedCount) {
      throw new NotFoundException('User does not exist!');
    } else if (!result.modifiedCount) {
      return {
        message: 'This user is already an admin!',
      };
    }

    return {
      message: 'Make this user as an admin successfully!',
    };
  }

  // Cheack email alrady exist?
  async findUserByEmail(email: string) {
    const result = await this.authModel.find({ email: email }).exec();
    return result;
  }
}
