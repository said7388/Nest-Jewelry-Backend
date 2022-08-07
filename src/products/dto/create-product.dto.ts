import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  vendor: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  rating: number;
}
