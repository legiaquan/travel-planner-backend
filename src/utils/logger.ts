import { Logger } from '@nestjs/common';

export class CustomLoggerService extends Logger {
  private static instance?: CustomLoggerService;

  constructor(context?: string) {
    super(context);
  }

  static getInstance(context?: string): CustomLoggerService {
    if (!CustomLoggerService.instance) {
      CustomLoggerService.instance = new CustomLoggerService(context);
    }
    return CustomLoggerService.instance;
  }

  error(message: string, stack?: string, context?: string): void {
    const formattedMessage = this.formatMessage('ERROR', message, context);
    super.error(formattedMessage, stack);
  }

  warn(message: string, context?: string): void {
    const formattedMessage = this.formatMessage('WARN', message, context);
    super.warn(formattedMessage);
  }

  log(message: string, context?: string): void {
    const formattedMessage = this.formatMessage('INFO', message, context);
    super.log(formattedMessage);
  }

  debug(message: string, context?: string): void {
    const formattedMessage = this.formatMessage('DEBUG', message, context);
    super.debug(formattedMessage);
  }

  verbose(message: string, context?: string): void {
    const formattedMessage = this.formatMessage('VERBOSE', message, context);
    super.verbose(formattedMessage);
  }

  protected formatMessage(level: string, message: string, context?: string): string {
    return message;
  }
}
