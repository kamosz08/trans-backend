import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DriversService } from 'src/drivers/drivers.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    private driversService: DriversService,
    private vehiclessService: VehiclesService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    await this.driversService.findOne(createOrderDto.driverId);
    await this.vehiclessService.findOne(createOrderDto.vehicleId);
    const newOrder = new this.orderModel(createOrderDto);
    const result = await newOrder.save();
    return result;
  }

  async findAll() {
    const result = await this.orderModel.find();

    const richResult = await Promise.all(
      result.map(async (item) => {
        const driver = await this.driversService.findOne(item.driverId);
        const vehicle = await this.vehiclessService.findOne(item.vehicleId);
        return {
          _id: item._id,
          price: item.price,
          name: item.name,
          driver: driver,
          vehicle: vehicle,
        };
      }),
    );

    return richResult;
  }

  async findOneBasic(id: string) {
    try {
      const result = await this.orderModel.findById(id);
      return result;
    } catch (e) {
      throw new NotFoundException('Could not find order');
    }
  }

  async findOne(id: string) {
    const result = await this.findOneBasic(id);
    const driver = await this.driversService.findOne(result.driverId);
    const vehicle = await this.vehiclessService.findOne(result.vehicleId);
    const richResult = {
      _id: result._id,
      price: result.price,
      name: result.name,
      driver: driver,
      vehicle: vehicle,
    };

    return richResult;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.findOneBasic(id);
    if (updateOrderDto.driverId)
      await this.driversService.findOne(updateOrderDto.driverId);
    if (updateOrderDto.vehicleId)
      await this.vehiclessService.findOne(updateOrderDto.vehicleId);
    for (const [key, value] of Object.entries(updateOrderDto)) {
      existingOrder[key] = value;
    }
    existingOrder.save();
    return null;
  }

  async remove(id: string) {
    const result = await this.orderModel.deleteOne({ _id: id });
    if (result.n === 0) {
      throw new NotFoundException('Could not find order');
    }
    return null;
  }
}
