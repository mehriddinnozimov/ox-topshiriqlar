import { Injectable } from '@nestjs/common';
import { CreateCompanyDTO } from './company.dto';
import { Role, User } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor() {}

  create(prismaService: PrismaTransaction, payload: CreateCompanyDTO, user: User) {
    return prismaService.company.create({
      data: {
        ...payload,
        users: {
          create: { user_id: user.id, role: Role.ADMIN },
        },
      },
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
}
