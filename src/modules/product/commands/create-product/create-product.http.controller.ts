import {
  Controller,
  Body,
  ConflictException as ConflictHttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { CreateProductRequestDto } from './create-product.request.dto';
import { User } from '@prisma/client';
import { GetUser } from 'src/libs/decorators';
import { JwtGuard } from 'src/libs/guard';
import { CreateProductService } from './create-product.service';

@Controller(routesV1.version)
export class CreateProductHttpController {
  constructor(private createProduct: CreateProductService) {}

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
  @UseGuards(JwtGuard)
  @Post(routesV1.product.createProduct)
  async create(@Body() body: CreateProductRequestDto, @GetUser() user: User) {
    const result = await this.createProduct.execute(body, user);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'product created successfully',
      data: result,
    };
  }
}
