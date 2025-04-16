import {
  Controller,
  Body,
  ConflictException as ConflictHttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { CreateProductRequestDto } from './create-product.request.dto';

@Controller(routesV1.version)
export class CreateProductHttpController {
  constructor(private readonly commadBus: CommandBus) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product Already Exist',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: '',
  })
  @Post(routesV1.product.createProduct)
  async create(@Body() body: CreateProductRequestDto) {
    // const command = new CreateProductCommand(body);
    // const result = await this.commadBus.execute(command);
  }
}
