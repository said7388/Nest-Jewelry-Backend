import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authSchema } from './entities/auth.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'users', schema: authSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
