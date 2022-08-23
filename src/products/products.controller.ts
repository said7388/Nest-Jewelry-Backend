import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    const { user } = req;
    if (user?.role !== 'admin') {
      throw new UnauthorizedException(
        'You have not access to create a new product!',
      );
    }
    return this.productsService.createNewProduct(createProductDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    const { user } = req;
    if (user?.role !== 'admin') {
      throw new UnauthorizedException(
        'You have not access for update this product!',
      );
    }
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteProduct(@Param('id') id: string, @Req() req) {
    const { user } = req;
    if (user?.role !== 'admin') {
      throw new UnauthorizedException(
        'You have not access for delete this product!',
      );
    }
    return this.productsService.deleteProduct(id);
  }
}
