import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get('all')
  getAllOrders(@GetUser() user) {
    if (user?.role !== 'admin') {
      throw new UnauthorizedException('You have not access to get all orders!');
    }
    return this.ordersService.findAllOrder();
  }

  @Get()
  findAll(@GetUser() user) {
    return this.ordersService.findOrderByEmail(user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.ordersService.findOne(id, user?.email);
  }

  @Patch(':id')
  updateOrderStatus(@Param('id') id: string, @GetUser() user) {
    if (user?.role !== 'admin') {
      throw new UnauthorizedException(
        'You have not access to update order status!',
      );
    }

    return this.ordersService.updateOrderStatus(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    return this.ordersService.remove(id, user.email);
  }
}
