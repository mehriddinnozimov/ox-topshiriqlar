import { HttpException, Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';
import { execWithRetry } from 'src/utils/common';
import axios, { AxiosError } from 'axios';
import { CreateCompanyDTO, GetProductsDTO } from 'src/company/company.dto';

@Injectable()
export class OxService {
  constructor(private configService: ConfigService) {}

  async getProfile(company: CreateCompanyDTO) {
    try {
      const url = `https://${company.subdomain}.${this.configService.OX_DOMAIN}/profile`;
      await execWithRetry(
        async () => {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${company.token}`,
            },
            timeout: 10000,
          });
          console.log(response.data);
          return response.data as unknown;
        },
        [],
        3,
        1000,
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const data = err.response?.data as { code: number; message: string };
        throw new HttpException(data.message, data.code);
      } else if (err instanceof Error) {
        throw err;
      }
    }
  }

  async getVariations(company: Company, query: GetProductsDTO) {
    try {
      const url = `https://${company.subdomain}.${this.configService.OX_DOMAIN}/variations`;
      const products = await execWithRetry(
        async () => {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${company.token}`,
            },
            timeout: 10000,
            params: query,
          });
          return response.data as {
            items: { id: number; name: string }[];
            total_count: number;
            page: number;
          };
        },
        [],
        3,
        1000,
      );

      return products;
    } catch (err) {
      if (err instanceof AxiosError) {
        const data = err.response?.data as { code: number; message: string };
        throw new HttpException(data.message, data.code);
      }

      throw err;
    }
  }
}
