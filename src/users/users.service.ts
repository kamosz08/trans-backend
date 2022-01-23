import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // async create(createUserDto: CreateUserDto) {
  //   const newUser = new this.userModel({
  //     ...createUserDto,
  //     isActive:
  //       typeof createUserDto.isActive === 'undefined'
  //         ? true
  //         : createUserDto.isActive,
  //   });
  //   const result = await newUser.save();
  //   return result.id as string;
  // }

  async findAll() {
    const result = await this.userModel.find();
    return result;
  }

  async findOne(id: string) {
    try {
      const result = await this.userModel.findById(id);
      return result;
    } catch (e) {
      throw new NotFoundException('Could not find user');
    }
  }

  async findOneByEmail(email: string) {
    try {
      const result = await this.userModel.findOne({ email });
      if (!result) throw new NotFoundException('Could not find user');
      return result;
    } catch (e) {
      throw new NotFoundException('Could not find user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);
    for (const [key, value] of Object.entries(updateUserDto)) {
      existingUser[key] = value;
    }
    existingUser.save();
    return null;
  }

  async remove(id: string) {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.n === 0) {
      throw new NotFoundException('Could not find user');
    }
    return null;
  }
}
