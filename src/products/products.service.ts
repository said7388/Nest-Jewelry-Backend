import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products')
    private readonly productModel: Model<ProductModel>,
  ) {}

  async findAll() {
    const products = await this.productModel.find().exec();
    return products;
  }

  async createNewProduct(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel(createProductDto);
    const result = await newProduct.save();
    return result;
  }

  async findOneById(id: string) {
    const product = await this.productModel.findOne({ _id: id }).exec();
    if (!product) {
      throw new NotFoundException('Product not found for this ID: ' + id);
    }
    return product;
  }

  async updateProduct(id: string, product: UpdateProductDto) {
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //   throw new BadRequestException('ID is invalid!');
    // }
    const filter = { _id: id };

    const result = await this.productModel.updateOne(filter, product, {
      rawResult: true,
    });

    console.log(result);

    if (result.matchedCount > 0) {
      return { message: 'Product updated successfully' };
    } else {
      throw new BadRequestException('Product updated failed!');
    }
  }

  // Delete a product by ID
  async deleteProduct(id: string) {
    const result = await this.productModel
      .findByIdAndDelete({ _id: id })
      .exec();

    if (!result) {
      throw new HttpException('Product Not Found!', HttpStatus.NOT_FOUND);
    }
    return { message: 'Product deleted successfully' };
  }
}
