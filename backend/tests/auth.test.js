const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth routes', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/signup', () => {
    it('creates a new user and returns a token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data.token).to.exist;
      expect(res.body.data.user.email).to.equal('test@example.com');
    });

    it('rejects duplicate email signup', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password_hash: 'hashedvalue',
      });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(409);
      expect(res.body.success).to.be.false;
    });

    it('rejects weak password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'weak@example.com', password: '123' });

      expect(res.status).to.equal(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with correct credentials', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(res.status).to.equal(200);
      expect(res.body.data.token).to.exist;
    });

    it('rejects wrong password', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Login User', email: 'login2@example.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login2@example.com', password: 'wrongpassword' });

      expect(res.status).to.equal(401);
    });
  });
});