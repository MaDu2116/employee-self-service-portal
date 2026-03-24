import request from 'supertest';
import app from '../../src/app';

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      // Even without DB, should return a response
      expect(res.status).toBeLessThanOrEqual(503);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 or 401 for empty credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: '', password: '' });
      expect([400, 401]).toContain(res.status);
    });

    it('should return error for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexist@test.com', password: 'wrong' });
      expect(res.body.success).toBe(false);
    });
  });

  describe('Protected routes without auth', () => {
    it('GET /api/profile should return 401', async () => {
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(401);
    });

    it('GET /api/payslips should return 401', async () => {
      const res = await request(app).get('/api/payslips');
      expect(res.status).toBe(401);
    });

    it('GET /api/policies should return 401', async () => {
      const res = await request(app).get('/api/policies');
      expect(res.status).toBe(401);
    });

    it('GET /api/requests should return 401', async () => {
      const res = await request(app).get('/api/requests');
      expect(res.status).toBe(401);
    });

    it('GET /api/announcements should return 401', async () => {
      const res = await request(app).get('/api/announcements');
      expect(res.status).toBe(401);
    });

    it('GET /api/org-chart should return 401', async () => {
      const res = await request(app).get('/api/org-chart');
      expect(res.status).toBe(401);
    });
  });

  describe('Auth with invalid token', () => {
    it('should return 401 for invalid bearer token', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });
  });
});
