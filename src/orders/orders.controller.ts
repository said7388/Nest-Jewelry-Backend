import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll(@GetUser() user) {
    return this.ordersService.findOrderByEmail(user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.ordersService.findOne(id, user?.email);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    return this.ordersService.remove(id, user.email);
  }
}
