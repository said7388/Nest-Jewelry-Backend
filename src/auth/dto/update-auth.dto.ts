import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './auth-model.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
