import { Injectable } from '@nestjs/common';
import { CreateCompanyDTO, GetProductsDTO } from './company.dto';
import { Company, Prisma, Role, User } from '@prisma/client';
import { OxService } from 'src/ox/ox.service';

@Injectable()
export class CompanyService {
  constructor(private oxService: OxService) {}

  register(prismaService: PrismaTransaction, payload: CreateCompanyDTO, user: User) {
    return prismaService.company.upsert({
      where: {
        subdomain: payload.subdomain,
      },
      create: {
        ...payload,
        users: {
          create: { user_id: user.id, role: Role.ADMIN },
        },
      },
      update: {
        users: {
          create: { user_id: user.id, role: Role.MANAGER },
        },
      },
    });
  }

  one(prismaService: PrismaTransaction, where: Prisma.CompanyWhereUniqueInput) {
    return prismaService.company.findUnique({
      where: where,
    });
  }

  addManager(prismaService: PrismaTransaction, companyId: number, userId: number) {
    return prismaService.userCompany.create({
      data: {
        company_id: companyId,
        user_id: userId,
        role: Role.MANAGER,
      },
    });
  }

  delete(prismaService: PrismaTransaction, companyId: number) {
    return prismaService.company.delete({
      where: { id: companyId },
    });
  }

  getUserCompany(
    prismaService: PrismaTransaction,
    userId: number,
    companyWhere: Partial<Pick<Prisma.CompanyWhereUniqueInput, 'id' | 'subdomain'>>,
  ) {
    return prismaService.userCompany.findFirst({
      where: {
        company: companyWhere,
        user_id: userId,
      },
      include: {
        company: true,
      },
    });
  }

  getVariations(company: Company, query: GetProductsDTO) {
    return this.oxService.getVariations(company, query);
  }
}
