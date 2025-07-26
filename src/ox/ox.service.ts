import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';
import { execWithRetry } from 'src/utils/common';

@Injectable()
export class OxService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getProfile(company: Company) {
    console.log({ company });
    const url = `https://${company.subdomain}.${this.configService.OX_DOMAIN}/profile`;
    console.log({ url });
    const response = await execWithRetry(
      () =>
        this.httpService.axiosRef.get(url, {
          headers: {
            Authorization: `Bearer ${company.token}`,
          },
        }),
      [],
      3,
      1000,
    );

    console.log({ response });
  }
}
