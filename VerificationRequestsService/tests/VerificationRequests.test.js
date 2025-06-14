const request = require("supertest");
const path = require("path");
const fs = require('fs');
const app = require('../src/app');
const axios = require('axios');
const VerificationRequest = require('../src/models/VerificationRequest');
const mongoose = require('mongoose');

let testModeratorToken;
let testMemberToken;

const rebootDataBase = async () => {
    await VerificationRequest.deleteMany();
}

const closeDataBaseConnection = async () => {
    await mongoose.connection.close()
}

const getToken = async (tokenType) => {
    await axios.post(process.env.AUTHENTICATION_SERVICE_URL, {
        username: (tokenType === 'Member') ? 'pale member' : 'pale',
        password: '123456789'
    })
    .then(function (response) {
        if (tokenType === 'Member') {
            testMemberToken = response.data.accessToken;
        } else {
            testModeratorToken = response.data.accessToken;
        }
    })
    .catch(function (error) {
        console.log('Verify that the authentication service is runnig')
        console.log(error);
    });
}

beforeAll(async () => {
    await rebootDataBase();
    await getToken('Member');
    await getToken('Moderator');
});

afterEach(async () => {
    await rebootDataBase();
});

afterAll(async () => {
    await closeDataBaseConnection();
    fs.rm(path.join(__dirname, './uploads'), {recursive: true}, fileRemovalErrorHandler = (error) => {
        if (error) {
            console.error(error);
        }
    });
});

describe('POST /betterme/verification-requests', () => {

    test("Add a new verification request successfully", async () => {
        const res = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents', 'test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("verificationRequest");
        expect(res.body.verificationRequest).toHaveProperty("id");
        expect(res.body.verificationRequest).toHaveProperty("date");
        expect(res.body.verificationRequest).toHaveProperty("status");
    });

    test("Add a new verification request with invalid authentication token", async () => {
        const res = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', 'Bearer tokeninvalido')
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents', 'test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));
        
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("msg"); 
        expect(res.body).toHaveProperty("error");
    });

    test("Add a new verification request without documents", async () => {
        const res = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", "")
            .attach("identification", "");
        
        expect(res.statusCode).toBe(500);
    });

    test("Add a duplicated verification request", async () => {
        await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const res = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));
        
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty("msg");
    });

});

describe('GET /betterme/verification-requests', () => {
    
    test("Get verification requests succesfully without cursor", async () => {
        await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const res = await request(app)
            .get('/betterme/verification-requests')
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({count: 10});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('verificationRequests');
        expect(res.body.verificationRequests).toHaveLength(1);
    });

    test("Get verification requests succesfully with count and cursor", async () => {
        await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const res = await request(app)
            .get('/betterme/verification-requests')
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({ count: 10, cursor: Date.now() });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('verificationRequests');
        expect(res.body.verificationRequests).toHaveLength(0);
    });

    test("Get verification requests without request body", async () => {
        const res = await request(app)
            .get('/betterme/verification-requests')
            .set('Authorization', `Bearer ${testModeratorToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('msg');
    });

    test("Get verification requests without required body fields", async () => {
        const res = await request(app)
            .get('/betterme/verification-requests')
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('msg');
    });

    test("Get verification requests with invalid token", async () => {
        const res = await request(app)
            .get('/betterme/verification-requests')
            .set('Authorization', `Bearer invalidtoken`);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('msg');
        expect(res.body).toHaveProperty('error');
    });

    test("Get verification requests with invalid role", async () => {
        const res = await request(app)
            .get('/betterme/verification-requests')
            .set('Authorization', `Bearer ${testMemberToken}`)
            .field('count', '10')
            .field('cursor', Date.now());

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('msg');
    });

});

describe('GET /betterme/verification-requests/uploads/:fileName', () => {

    test("Get a verification request document succesfully", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const addedVerificationRequest = await VerificationRequest.findById(postRes.body.verificationRequest.id).exec();
        const fileName = (addedVerificationRequest.identificationUrl.split('/'))[2];
        const res = await request(app)
            .get(`/betterme/verification-requests/uploads/${fileName}`)
            .set('Authorization', `Bearer ${testModeratorToken}`);
        
        expect(res.statusCode).toBe(200);
    });

    test("Get a verification request document with invalid token", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const addedVerificationRequest = await VerificationRequest.findById(postRes.body.verificationRequest.id).exec();
        const fileName = (addedVerificationRequest.identificationUrl.split('/'))[2];
        const res = await request(app)
            .get(`/betterme/verification-requests/uploads/${fileName}`)
            .set('Authorization', `Bearer invalidToken`);
        
        expect(res.statusCode).toBe(401);
    });

    test("Get a verification request document with invalid role", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const addedVerificationRequest = await VerificationRequest.findById(postRes.body.verificationRequest.id).exec();
        const fileName = (addedVerificationRequest.identificationUrl.split('/'))[2];
        const res = await request(app)
            .get(`/betterme/verification-requests/uploads/${fileName}`)
            .set('Authorization', `Bearer ${testMemberToken}`);
        
        expect(res.statusCode).toBe(403);
    });

    test("Get a non existent verification request document", async () => {
        const res = await request(app)
            .get(`/betterme/verification-requests/uploads/test_identification.png`)
            .set('Authorization', `Bearer ${testModeratorToken}`);
        
        expect(res.statusCode).toBe(404);
    });
});

describe('PATCH /betterme/verification-requests/:id', () => {
    
    test("Evaluate a verification request successfully", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "test_documents/test_identification.png"));
        
        const res = await request(app)
            .patch(`/betterme/verification-requests/${postRes.body.verificationRequest.id}`)
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({ approved: true });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('msg');
    });

    test("Evaluate a verification request without required body", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "test_documents/test_identification.png"));
        
        const res = await request(app)
            .patch(`/betterme/verification-requests/${postRes.body.verificationRequest.id}`)
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({})

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('msg');
    });

    test("Evaluate a verification request with non existent id", async () => {
        const res = await request(app)
            .patch(`/betterme/verification-requests/a82d6a567baaaa2127a37742`)
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({ approved: true });
        
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('msg');
    });

    test("Evaluate a verification request that is already evaluated", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        await request(app)
            .patch(`/betterme/verification-requests/${postRes.body.verificationRequest.id}`)
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({ approved: true});

        const secondResPatch = await request(app)
            .patch(`/betterme/verification-requests/${postRes.body.verificationRequest.id}`)
            .set('Authorization', `Bearer ${testModeratorToken}`)
            .send({ approved: true});
        
        expect(secondResPatch.statusCode).toBe(409);
        expect(secondResPatch.body).toHaveProperty('msg');
    });

    test("Evaluate a verification request with invalid token", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const res = await request(app)
            .patch(`/betterme/verification-requests/${postRes.body.verificationRequest.id}`)
            .set('Authorization', `Bearer invalidToken`)
            .send({ approved: true});
        
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('msg');
    });

    test("Evaluate a verification request with invalid role", async () => {
        const postRes = await request(app)
            .post("/betterme/verification-requests")
            .set('Authorization', `Bearer ${testMemberToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach("certificate", path.join(__dirname, 'test_documents/test_certificate.png'))
            .attach("identification", path.join(__dirname, "/test_documents/test_identification.png"));

        const res = await request(app)
            .patch(`/betterme/verification-requests/${postRes.body.verificationRequest.id}`)
            .set('Authorization', `Bearer ${testMemberToken}`)
            .send({ approved: true });
        
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('msg');
    });
});