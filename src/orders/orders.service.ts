import { Injectable } from '@nestjs/common';
import { Order } from './interfaces/order.interface';

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [];

  create(order: Order) {
    this.orders.push(order);
  }

  findAll() {
    return this.orders;
  }
}
