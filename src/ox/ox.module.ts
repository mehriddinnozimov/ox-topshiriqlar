import { Module } from '@nestjs/common';
import { OxService } from './ox.service';

@Module({
  providers: [OxService],
  exports: [OxService],
  imports: [],
})
export class OxModule {}
