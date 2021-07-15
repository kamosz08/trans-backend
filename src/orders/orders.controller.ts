import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async findAll(@Res() request: Request) {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params) {
    console.log(params.id);

    return 'One order';
  }

  @Post()
  @HttpCode(204)
  async create(@Body() createOrderDto: CreateOrderDto) {
    this.ordersService.create(createOrderDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updaterderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} order`;
  }
}
