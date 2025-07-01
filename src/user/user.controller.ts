import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user-request';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  createuser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }
}
