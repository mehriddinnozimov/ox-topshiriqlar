import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  @Public()
  health() {
    return { success: true };
  }
}
