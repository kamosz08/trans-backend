import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel('Vehicle') private readonly vehicleModel: Model<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const newVehicle = new this.vehicleModel(createVehicleDto);
    const result = await newVehicle.save();
    return result;
  }

  async findAll() {
    const result = await this.vehicleModel.find();
    return result;
  }

  async findOne(id: string) {
    try {
      const result = await this.vehicleModel.findById(id);
      return result;
    } catch (e) {
      throw new NotFoundException('Could not find vehicle');
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const existingVehicle = await this.findOne(id);
    for (const [key, value] of Object.entries(updateVehicleDto)) {
      existingVehicle[key] = value;
    }
    existingVehicle.save();
    return null;
  }

  async remove(id: string) {
    const result = await this.vehicleModel.deleteOne({ _id: id });
    if (result.n === 0) {
      throw new NotFoundException('Could not find vehicle');
    }
    return null;
  }
}
