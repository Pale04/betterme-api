// tests/users.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;

  app = require('../src/app');
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
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
      await request(app).get(`/api/users/${created.account._id}`).expect(404);
    });
  });

  describe('🛡️  POST /api/users/moderator', () => {
  const payload = {
    username:   'modUser',
    password:   'SuperSecret!',
    email:      'mod@example.com',
    name:       'Mod Man',
    birthday:   '1985-11-25',
    description:'I moderate stuff',
    phone:      '555-0000',
    website:    'https://mods.example.com'
  };

    it('should create a new moderator account and return 201 + correct userType', async () => {
      const res = await request(app)
        .post('/api/users/moderator')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('msg', `Account ${payload.username} created`);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('account');
      const acct = res.body.user.account;
      expect(acct).toHaveProperty('username', payload.username);
      expect(acct).toHaveProperty('userType', 'Moderator');
      expect(acct).not.toHaveProperty('password');
    });

    it('should return 500 if required field is missing', async () => {
      const { username, ...bad } = payload;
      const res = await request(app)
        .post('/api/users/moderator')
        .send(bad);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('msg', 'Error while creating user');
    });
  });
  
  describe('PATCH /api/users/:id/verification', () => {
    it('Should update the verification property successfully', async () => {
      const newUserResponse = await request(app).post('/api/users').send({
        username:   'foo123',
        password:   'Secret123!',
        email:      'foo@example.com',
        name:       'Foo Bar',
        birthday:   '1990-05-20',
        description:'test user',
        phone:      '555-1234',
        website:    'https://foo.com'
      })

      const res = await request(app)
        .patch(`/api/users/${newUserResponse.body.user._id}/verification`)
        .send({verified: true});
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('msg', 'The user verification was given');
    });

    it('Include a non existent id', async () => {
      const res = await request(app)
        .patch(`/api/users/684742f2490d28da6a7a79f2/verification`)
        .send({verified: true});

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('msg', 'User not found');
    });

    it('Not include a required request body', async () => {
      const res = await request(app)
        .patch(`/api/users/684742f2490d28da6a7a79f2/verification`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'The verified parameter is required');
    });
  });
});
