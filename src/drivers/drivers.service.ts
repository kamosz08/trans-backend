import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel('Driver') private readonly driverModel: Model<Driver>,
  ) {}

  async create(createDriverDto: CreateDriverDto) {
    const newDriver = new this.driverModel(createDriverDto);
    const result = await newDriver.save();
    return result;
  }

  async findAll() {
    const result = await this.driverModel.find();
    return result;
  }

  async findOne(id: string) {
    try {
      const result = await this.driverModel.findById(id);
      return result;
    } catch (e) {
      throw new NotFoundException('Could not find driver');
    }
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const existingDriver = await this.findOne(id);
    for (const [key, value] of Object.entries(updateDriverDto)) {
      existingDriver[key] = value;
    }
    existingDriver.save();
    return null;
  }

  async remove(id: string) {
    const result = await this.driverModel.deleteOne({ _id: id });
    if (result.n === 0) {
      throw new NotFoundException('Could not find driver');
    }
    return null;
  }
}
