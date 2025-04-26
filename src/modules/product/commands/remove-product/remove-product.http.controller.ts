import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { DeleteProductsParamsDto } from './remove-product.request.dto';
import { RemoveProductService } from './remove-product.service';
import { JwtGuard } from 'src/libs/guard';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';

@Controller(routesV1.version)
export class RemoveProductByIdHttpController {
  constructor(private removeProduct: RemoveProductService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(routesV1.product.removeProduct)
  @ApiOperation({ summary: 'find and delete product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async removeProductById(
    @Param() params: DeleteProductsParamsDto,
    @GetUser() user: User,
  ) {
    const result = await this.removeProduct.execute(params.id, user);

    return result;
  }
}
