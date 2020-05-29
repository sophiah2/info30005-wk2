// unit, integration and functional tests
const request = require('supertest');
const chai = require('chai');
const { expect } = chai;

const app = require('../server');

describe('Functional Test - Login', function() {

    it('Should return error 422 if user email and password are empty', function(done) {
        request(app)
            .post('/credentials')
            .send({})
            .expect(422)
            .end(done);
    });

    it('Should success if credential is valid', function(done) {
        request(app)
            .post('/credentials')
            .send({ email: '123@123.com', password: '123' })
            .expect(200)
            .end(done);
    });
});