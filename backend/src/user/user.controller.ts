import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('students')
  async getStudents(@Query('search') search?: string) {
    return this.userService.getStudents(search);
  }

  @Get('staff')
  async getStaff(@Query('search') search?: string) {
    return this.userService.getStaff(search);
  }

  @Post('staff')
  async createStaff(
    @Body()
    body: {
      name: string;
      email: string;
      wa_number?: string;
      password?: string;
      status?: string;
    },
  ) {
    return this.userService.createStaff(body);
  }

  @Patch('staff/:id')
  async updateStaff(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      email?: string;
      wa_number?: string;
      status?: string;
    },
  ) {
    return this.userService.updateStaff(id, body);
  }

  @Post('reset-password')
  async resetPassword(@Body('identifier') identifier: string) {
    return this.userService.resetPassword(identifier);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id') id: string) {
    return this.userService.deleteStaff(id);
  }
}
