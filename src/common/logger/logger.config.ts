import { RequestMethod } from '@nestjs/common';
import { Request, Response } from 'express';
import { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        colorize: process.env.NODE_ENV !== 'production',
        levelFirst: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
    customProps: () => ({
      context: 'HTTP',
      environment: process.env.NODE_ENV || 'development',
      service: 'travel-planner-api',
    }),
    serializers: {
      req: (req: Request) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        body: (req as any).raw.body as Record<string, unknown>,
        headers: {
          'user-agent': req.headers['user-agent'],
          'x-forwarded-for': req.headers['x-forwarded-for'],
          'x-real-ip': req.headers['x-real-ip'],
        },
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
        message: res.statusMessage || (res.statusCode >= 400 ? 'Error occurred' : 'Success'),
      }),
      err: (err: Error) => ({
        type: err.name,
        message: err.message,
        stack: err.stack,
      }),
    },
    customLogLevel: (req: Request, res: Response, err: Error) => {
      if (res.statusCode >= 500 || err) {
        return 'error';
      }
      if (res.statusCode >= 400) {
        return 'warn';
      }
      return 'info';
    },
    customSuccessMessage: (req: Request, res: Response) => {
      return `Request completed - ${req.method} ${req.url} ${res.statusCode} - ${res.statusMessage || 'Success'}`;
    },
    customErrorMessage: (req: Request, res: Response, err: Error) => {
      return `Request failed - ${req.method} ${req.url} ${res.statusCode} - ${err?.message || res.statusMessage || 'Error occurred'}`;
    },
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.confirmPassword',
        'req.body.token',
        'req.body.refreshToken',
      ],
      censor: '**REDACTED**',
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
      level: (label: string) => {
        return { level: label.toUpperCase() };
      },
    },
  },
  exclude: [
    { method: RequestMethod.ALL, path: 'health' },
    { method: RequestMethod.ALL, path: 'favicon.ico' },
  ],
};
