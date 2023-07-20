import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';
import { MONGO_ERROR_MESSAGES } from '../constants/mongo.constant';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 1100:
        status = HttpStatus.CONFLICT;
        message = MONGO_ERROR_MESSAGES.DUPLICATE_ENTRY;
        break;
      case 121:
        status = HttpStatus.BAD_REQUEST;
        message = MONGO_ERROR_MESSAGES.DOCUMENT_VALIDATION_ERROR;
        break;
      case 10287:
        status = HttpStatus.BAD_REQUEST;
        message = MONGO_ERROR_MESSAGES.READ_CONCERN_ERROR;
        break;
      case 16500:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = MONGO_ERROR_MESSAGES.INTERNAL_CURSOR_ERROR;
        break;
      case 26400:
        status = HttpStatus.UNAUTHORIZED;
        message = MONGO_ERROR_MESSAGES.AUTHENTICATION_ERROR;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = MONGO_ERROR_MESSAGES.GENERIC_ERROR;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timeStamp: new Date().toISOString(),
    });
  }
}
