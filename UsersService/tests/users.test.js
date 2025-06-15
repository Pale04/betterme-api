// tests/users.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

let app;
let mongoServer;

beforeAll(async () => {
  // start an in-memory MongoDB replica set (needed for transactions support)
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;

  // load your Express app _after_ setting MONGO_URI
  app = require('../src/app');
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // drop the entire database between each test
  await mongoose.connection.dropDatabase();
});

describe('📦 Users API', () => {
  const newUser = {
    username:   'foo123',
    password:   'Secret123!',
    email:      'foo@example.com',
    name:       'Foo Bar',
    birthday:   '1990-05-20',
    description:'test user',
    phone:      '555-1234',
    website:    'https://foo.com'
  };

  describe('GET /api/users', () => {
    it('returns [] when no users exist', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it('returns the newly created user', async () => {
      await request(app).post('/api/users').send(newUser).expect(201);
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      const user = res.body[0];
      expect(user.account.username).toBe(newUser.username);
      expect(user.account).not.toHaveProperty('password');
    });
  });

  describe('GET /api/users/:id', () => {
    it('404 when user not found', async () => {
      await request(app).get('/api/users/0123456789abcdef01234567').expect(404);
    });

    it('returns a single user by account id', async () => {
      const postRes = await request(app).post('/api/users').send(newUser).expect(201);
      const created = postRes.body.user;
      const res = await request(app).get(`/api/users/${created.account._id}`);
      expect(res.status).toBe(200);
      expect(res.body.account.username).toBe(newUser.username);
    });
  });

  describe('POST /api/users', () => {
    it('201 + payload.msg when creating succeeds', async () => {
      const res = await request(app).post('/api/users').send(newUser);
      expect(res.status).toBe(201);
      expect(res.body.msg).toMatch(/Account foo123 created/);
      expect(res.body.user.account.username).toBe(newUser.username);
    });

    it('500 on missing required field', async () => {
      const { username, ...bad } = newUser;
      const res = await request(app).post('/api/users').send(bad);
      expect(res.status).toBe(500);
      expect(res.body.msg).toMatch(/Error while creating user/);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('404 if account id not found', async () => {
      await request(app)
        .put('/api/users/0123456789abcdef01234567')
        .send({
          username:'x', email:'x@x.com', name:'x',
          active:true, userType:'Member',
          birthday:'2000-01-01', description:'', phone:'', website:''
        })
        .expect(404);
    });

    it('200 + updated user when valid', async () => {
      const postRes = await request(app).post('/api/users').send(newUser).expect(201);
      const created = postRes.body.user;
      const update = {
        username:   'foo456',
        email:      'new@ex.com',
        name:       'Foo Updated',
        active:     false,
        userType:   'Moderator',
        birthday:   '2000-01-02',
        description:'upd',
        phone:      '999',
        website:    'https://updated.com'
      };
      const res = await request(app)
        .put(`/api/users/${created.account._id}`)
        .send(update);
      expect(res.status).toBe(200);
      expect(res.body.msg).toMatch(/User .* updated/);
      expect(res.body.user.account.username).toBe(update.username);
      expect(res.body.user.account.userType).toBe(update.userType);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('404 if not exists', async () => {
      await request(app).delete('/api/users/0123456789abcdef01234567').expect(404);
    });

    it('200 + message when deleted', async () => {
      const postRes = await request(app).post('/api/users').send(newUser).expect(201);
      const created = postRes.body.user;
      const res = await request(app).delete(`/api/users/${created.account._id}`);
      expect(res.status).toBe(200);
      expect(res.body.msg).toMatch(/User .* deleted/);

      // subsequent get should 404
      await request(app).get(`/api/users/${created.account._id}`).expect(404);
    });
  });

  describe('PATCH /api/users/:id/password', () => {
    it('204 if successful', async () => {
      await request(app).patch('/api/users/0123456789abcdef01234567/password/').send({currentPassword:'Secret123!', newPassword:'Secret1234!'}).expect(204);
    });

    it('401 if current password is wrong', async () => {
      await request(app).patch('/api/users/0123456789abcdef01234567/password/').send({currentPassword:'Secret153!', newPassword:'Secret1234!'}).expect(401);
    });

    it('404 if user does not exist', async () => {
      await request(app).patch('/api/users/0123456789abcdef01234aaa/password/').send({currentPassword:'Secret153!', newPassword:'Secret1234!'}).expect(401);
    });
  });
});
