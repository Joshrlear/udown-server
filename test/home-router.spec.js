const app = require('../src/app');
const request = require('supertest');

describe('GET /map', () => {
  it('responds with json object and status 200', () => {
    return request(app)
      .get('/home/map')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  });
});