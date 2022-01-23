import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { JwtRtAuthGuard } from 'src/common/guards/jwt-rt-guard.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @Public()
  @UseGuards(JwtRtAuthGuard)
  @Post('refresh')
  refreshTokens(@Request() req) {
    return this.authService.refreshTokens(req.user);
  }
}
