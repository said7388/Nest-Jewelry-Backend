import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderModel } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('orders')
    private readonly orderModel: Model<OrderModel>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user) {
    const { email } = user;
    const { productID } = createOrderDto;
    const product = await this.productsService.findProductById(productID);
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    const newOrder = new this.orderModel({
      ...createOrderDto,
      email,
    });

    const result = await newOrder.save();
    if (result) {
      return {
        message: 'Oder placement was successfully',
      };
    }
  }

  async findOrderByEmail(email: string) {
    const orders = await this.orderModel.find({ email: email }).exec();
    return orders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
