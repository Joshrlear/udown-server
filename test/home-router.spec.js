const homeRouter = require('../src/Home/Home-Router');
const request = require('supertest');

describe('GET /map', () => {
  it('responds with json object and status 200', () => {
    return request(homeRouter)
      .get('/map')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('object');
      })
  });
});