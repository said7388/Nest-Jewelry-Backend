import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  vendor: string;

  @IsOptional()
  price: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  rating: number;
}
