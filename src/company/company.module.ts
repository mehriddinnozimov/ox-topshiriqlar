import { Module } from '@nestjs/common';
import { OxModule } from 'src/ox/ox.module';
import { CompanyController } from './company.contoller';
import { CompanyService } from './company.service';

@Module({
  exports: [],
  providers: [CompanyService],
  imports: [OxModule],
  controllers: [CompanyController],
})
export class CompanyModule {}
