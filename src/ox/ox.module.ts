import { Module } from '@nestjs/common';
import { OxService } from './ox.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [OxService],
  exports: [OxService],
  imports: [HttpModule],
})
export class OxModule {}
