// unit, integration and functional tests
var request = require('supertest');

var chai = require('chai')
var expect = chai.expect;
chai.use(require('chai-http'));

const app = require('../server');

describe('Unit Test - Input Validation', function() {

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


describe('HTTP integration testing with Chai assertions - Navigation to the welcome page', function() {

    it('Should be navigated to the welcome page after login successfully', function(done) {
        request(app)
            .post('/credentials')
            .send({ email: '123@123.com', password: '123' })
            .end((err, res) => {  
                expect(res).to.redirectTo('/homepage');
                done();
            });
    });

});

describe('Functional Test - User Login', function() {
    


    it('Should success if credential is valid', function(done) {
        request(app)
            .post('/credentials')
            .send({ email: '123@123.com', password: '123' })
            .expect(302)
            .end(done);
    });

});