import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product Name or Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @ApiProperty({
    description: 'Vendor Name of the product',
    example: 'Nike',
  })
  vendor: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  rating: number;
}
