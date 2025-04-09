import { Controller, Get, Post } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

@Controller('metrics')
export class MetricsController {
  private readonly testCounter: Counter;
  private readonly testHistogram: Histogram;

  constructor() {
    // Tạo một counter metric
    this.testCounter = new Counter({
      name: 'test_counter',
      help: 'A test counter metric',
      labelNames: ['status'],
    });

    // Tạo một histogram metric
    this.testHistogram = new Histogram({
      name: 'test_histogram',
      help: 'A test histogram metric',
      labelNames: ['operation'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });
  }

  @Get('test-counter')
  testCounterMetric() {
    // Tăng counter với label status
    this.testCounter.inc({ status: 'success' });
    return {
      message: 'Counter has been incremented',
    };
  }

  @Post('test-histogram')
  testHistogramMetric() {
    // Đo thời gian thực hiện một operation
    const end = this.testHistogram.startTimer({ operation: 'test' });

    // Giả lập một số công việc
    setTimeout(() => {
      end();
    }, Math.random() * 1000);

    return {
      message: 'Histogram has been updated',
    };
  }
}
