import { registerAs } from '@nestjs/config';

export default registerAs('monitoring', () => ({
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  },
  prometheus: {
    defaultMetrics: {
      enabled: true,
      prefix: 'travel_planner_',
    },
    defaultLabels: {
      app: 'travel-planner',
      environment: process.env.NODE_ENV || 'development',
    },
  },
}));
