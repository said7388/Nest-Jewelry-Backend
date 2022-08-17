import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
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

  async findOne(id: string, email: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!(email === order?.email)) {
      throw new UnauthorizedException('You have not access for this order!');
    }
    return order;
  }

  async remove(id: string, email: string) {
    const result = await this.orderModel
      .findOneAndRemove({ _id: id, email: email })
      .exec();
    if (!result) {
      throw new UnauthorizedException('You have not access for this order!');
    }
    return { message: 'Order deleted successfully!' };
  }
}
