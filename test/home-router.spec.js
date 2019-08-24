const app = require('../src/app');
const request = require('supertest');

describe('GET /map', () => {
  it('responds with json object and status 200', (done) => {
     request(app)
      .get('/home/map')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('object');
      })
      setTimeout(done, 0)
  });
});