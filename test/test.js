// unit, integration and functional tests
const request = require('supertest');
const chai = require('chai');
const { expect } = chai;

const app = require('../server');

describe('Unit Test - Validation', function() {

    it('Should return "Invalid email address" if user email is invalid', function(done) {
        request(app)
            .post('/credentials')
            .send({email: '123123.com', password: '111'})
            .expect("Invalid email address\n")
            .end(done);
    });

    it('Should return "Password must be at least 3 chars long" if password is less than 3 chars', function(done) {
        request(app)
            .post('/credentials')
            .send({email: '123@123.com', password: '11'})
            .expect("Password must be at least 3 chars long\n")
            .end(done);
    });

    it('Should return "Invalid email address and Password must be at least 3 chars long" if user email is invalid and password is less than 3 chars', function(done) {
        request(app)
            .post('/credentials')
            .send({email: '123123.com', password: '11'})
            .expect("Invalid email address\nPassword must be at least 3 chars long\n")
            .end(done);
    });

});

describe('Functional Test - Login', function() {

    it('Should return "User does not exit" if user email or password does not exit', function(done) {
        request(app)
            .post('/credentials')
            .send({email: '123@123.com', password: '111'})
            .expect("User does not exit")
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