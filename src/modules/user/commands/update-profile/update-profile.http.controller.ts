import { Body, Controller, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { JwtGuard } from 'src/libs/guard';
import { UpdateProfileService } from './update-profile.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/libs/decorators';
import { UpdateUserRequestDto } from './update-profile.request.dto';

@Controller(routesV1.version)
export class UpdateProfileHttpController {
  constructor(private updateProfile: UpdateProfileService) {}

  @ApiOperation({ summary: 'update user profile with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  @UseGuards(JwtGuard)
  @Put(routesV1.user.updateProfile)
  async update(@Body() body: UpdateUserRequestDto, @GetUser() user: User) {
    const result = await this.updateProfile.execute(body, user);

    return result;
  }
}
