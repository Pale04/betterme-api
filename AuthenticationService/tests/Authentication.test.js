const request = require("supertest");
const app = require('../src/app');
const mongoose = require('mongoose');

afterAll(async () => {
    await mongoose.connection.close()
});

describe('POST /api/authentication', () => {
    test("Log in succesfully", async () => {
        const res = await request(app)
            .post("/api/authentication/login")
            .send({username: 'pale member', password: '123456789'});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });

    test("Log in with non existent credentials", async () => {
        const res = await request(app)
            .post("/api/authentication/login")
            .send({username: '', password: ''});

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("msg");
    });

    test("Log in without required credentials", async () => {
        const res = await request(app)
            .post("/api/authentication/login");

        expect(res.statusCode).toBe(500);
    });
});