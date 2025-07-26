import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Something went wrong.';
    let status = 500;

    console.error('Unhandled error:', exception);

    if (exception instanceof HttpException) {
      const _status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      if (_status !== 500) {
        message = exception.getResponse() as string;
        status = _status;
      }
    }

    response.status(status).json({
      success: false,
      message,
    });
  }
}
