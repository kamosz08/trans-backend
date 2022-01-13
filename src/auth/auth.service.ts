import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const isPasswordMatch = await compare(pass, user.password);
      if (isPasswordMatch) return { username: user.username, userId: user._id };
      return null;
    }
    return null;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(username: string, userId: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { username: username, sub: userId },
        { expiresIn: '1h', secret: process.env.SECRET },
      ),
      this.jwtService.signAsync(
        { username: username, sub: userId },
        { expiresIn: '10h', secret: process.env.SECRET_RT },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hashedRt = await this.hashData(rt);
    await this.userModel.updateOne({ _id: userId }, { hashedRt });
  }

  async register(user: CreateUserDto) {
    const newUser = new this.userModel({
      ...user,
      isActive: typeof user.isActive === 'undefined' ? true : user.isActive,
    });
    const result = await newUser.save();
    const tokens = await this.getTokens(result.username, result._id);
    await this.updateRtHash(result.id, tokens.refresh_token);

    return tokens;
  }

  async login(user: { username: string; userId: string }) {
    const tokens = await this.getTokens(user.username, user.userId);
    await this.updateRtHash(user.userId, tokens.refresh_token);

    return tokens;
  }

  async logout(user: { username: string; userId: string }) {
    await this.userModel.updateOne({ _id: user.userId }, { hashedRt: null });

    return true;
  }

  async refreshTokens({
    userId,
    refreshToken: rt,
  }: {
    username: string;
    userId: string;
    refreshToken: string;
  }) {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user || !user.hashedRt) throw new UnauthorizedException();

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new UnauthorizedException();

    const tokens = await this.getTokens(user.username, user._id);
    await this.updateRtHash(user._id, tokens.refresh_token);
    return tokens;
  }
}
