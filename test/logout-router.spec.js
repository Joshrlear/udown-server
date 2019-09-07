const knex = require('knex')
const request = require('supertest');

describe('GET /', () => {

  before('make knex instance', () => {
    const { DB_URL } = require('../src/config')
    const db = knex({
      client: 'pg',
      connection: DB_URL,
    })    

    app.set('db', db)
  })

  it('responds with json object and status 200', () => {
    request(app)
      .get(`/logout`)
      .expect('Content-Type', /json/)
  });
});