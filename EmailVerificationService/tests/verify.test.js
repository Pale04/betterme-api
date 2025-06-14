// tests/verify.test.js
process.env.NODE_ENV  = 'test';
process.env.USERS_API = 'http://fake';     // no se contacta realmente

const request              = require('supertest');
const mongoose             = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../src/app');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  jest.resetAllMocks();               // limpia spies de axios
});

describe('API • Email verification flow', () => {

  const payload = {
    username : 'testuser',
    name     : 'John Doe',
    email    : 'john@test.com',
    birthday : '2000-01-01',
    password : 'Secret123$'
  };

  test('initiate and confirm Creates new account and return 200 & 201', async () => {

    const initRes = await request(app)
      .post('/api/verify/initiate')
      .send(payload);

    expect(initRes.statusCode).toBe(200);

    const VerificationCode = mongoose.model('VerificationCode');
    const record = await VerificationCode.findOne({ email: payload.email });
    expect(record).not.toBeNull();
    const codeTest = record.code;         

    const confRes = await request(app)
      .post('/api/verify/confirm')
      .send({ email: payload.email, code: codeTest });

    expect(confRes.statusCode).toBe(201);
    expect(confRes.body.ok).toBe(true);   

    const remains = await VerificationCode.findOne({ email: payload.email });
    expect(remains).toBeNull();

    const axios = require('axios');
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'http://fake/api/users',
      expect.objectContaining({ email: payload.email })
    );
  });

  test('confirm inputs invalid code and returns 400', async () => {
    const res = await request(app)
      .post('/api/verify/confirm')
      .send({ email: 'john@test.com', code: 'BAD999' });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toMatch(/inválido|expirado/);
  });

});
