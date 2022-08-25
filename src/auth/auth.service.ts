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
import { TwilioService } from 'nestjs-twilio';
import { confirmEmailLink } from 'src/utils/confirmEmailLink';
import { sendEmail } from 'src/utils/sendMail';
import { CreateAuthDto, LoginAuthDto } from './dto/auth-model.dto';
import { AuthModel } from './entities/auth.entity';
import { getProfile } from './helper/profile';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private readonly authModel: Model<AuthModel>,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
  ) {}

  // create new user account function
  async createNewUser(createAuthDto: CreateAuthDto) {
    const { fullName, email, password } = createAuthDto;
    const salt = await bycript.genSalt();
    const hashPassword = await bycript.hash(password, salt);
    const newUser = new this.authModel({
      fullName,
      email,
      password: hashPassword,
      salt,
    });
    const existingUser = await this.findUserByEmail(email);
    if (existingUser.length > 0) {
      throw new ConflictException('This email alrady taken!');
    }
    const result = await newUser.save();
    const profile = getProfile(result);
    await sendEmail(profile, await confirmEmailLink(profile.id));
    const accessToken = await this.jwtService.sign(profile);
    return { profile, accessToken };
  }

  // user login function
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
    const profile = getProfile(user);

    if (!(hashPassword === db_password)) {
      throw new BadRequestException('Password does not match!');
    } else if (!user.active) {
      await sendEmail(profile, await confirmEmailLink(profile.id));
      throw new BadRequestException({
        message: 'Please check your mail and confirm your email address!',
        active: false,
      });
    }
    // genarate JWT token
    const accessToken = await this.jwtService.sign(profile);
    return {
      message: 'User Login Successfully!',
      profile,
      accessToken,
    };
  }

  // Confirm user account by email
  async confirmEmailLink(id: string) {
    await this.authModel.updateOne({ _id: id }, { $set: { active: true } });
    return {
      message: 'Make Your Account Confirm successfully!',
      active: true,
    };
  }

  // send sms verification code to user
  async sendSms(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000);

    const result = await this.twilioService.client.messages.create({
      body: `Your Jewelry Verification code: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    if (result) {
      return { message: 'Verification code sent successfully!' };
    }
  }

  // make a user as an administrator by another admin
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
