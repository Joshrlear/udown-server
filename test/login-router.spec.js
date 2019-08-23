const loginRouter = require('../src/users/login-router');
const request = require('supertest');

describe('POST /', () => {

    const newUser = {
        username: 'test',
        password: 'password'
    }

    it('responds with json object and status 200', () => {
      return request(loginRouter)
        .post('/')
        .send(newUser)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('object');
        })
    });
});