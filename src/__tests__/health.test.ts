import request from 'supertest';

import { healthRouter } from '../domains/health/controller/health.controller';

describe('server health', () => {
  test('heath test', () => {
    request(healthRouter).get('/').expect(200);
  });
});
