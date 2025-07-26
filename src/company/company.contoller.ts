import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCompanyDTO, GetProductsDTO } from './company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyService } from './company.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Company, Role, User } from '@prisma/client';
import { OxService } from 'src/ox/ox.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_AUTH_KEY } from 'src/constants';

@Controller('company')
@ApiBearerAuth(SWAGGER_AUTH_KEY)
export class CompanyController {
  constructor(
    private prismaService: PrismaService,
    private companyService: CompanyService,
    private oxService: OxService,
  ) {}

  @Post('/register')
  async register(@GetUser() user: User, @Body() payload: CreateCompanyDTO) {
    await this.oxService.getProfile(payload);
    const userCompany = await this.companyService.getUserCompany(this.prismaService, user.id, {
      subdomain: payload.subdomain,
    });

    if (userCompany) {
      throw new BadRequestException('You already conneted to this company');
    }
    const company = await this.companyService.register(this.prismaService, payload, user);

    return { success: true, company };
  }

  @Delete(':company_id')
  async delete(@GetUser() user: User, @Param('company_id') company_id: number) {
    const userCompany = await this.companyService.getUserCompany(this.prismaService, user.id, {
      id: company_id,
    });

    if (!userCompany || userCompany.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete this company');
    }
    const company = await this.companyService.delete(this.prismaService, company_id);

    return { success: true, company };
  }

  @Get(':company_id/products')
  async getProducts(
    @GetUser() user: User,
    @Param('company_id') company_id: number,
    @Query() query: GetProductsDTO,
  ) {
    const userCompany = await this.companyService.getUserCompany(this.prismaService, user.id, {
      id: company_id,
    });

    if (!userCompany || userCompany.role !== Role.MANAGER) {
      throw new ForbiddenException('You are not allowed to get products of this company');
    }
    const variations = await this.companyService.getVariations(
      userCompany.company as Company,
      query,
    );

    return {
      success: true,
      products: variations.items,
      page: variations.page,
      total_count: variations.total_count,
    };
  }
}
