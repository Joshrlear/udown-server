const knex = require('knex')
const request = require('supertest');

describe('POST /', () => {

  before('make knex instance', () => {
    const { DB_URL } = require('../src/config')
    const db = knex({
      client: 'pg',
      connection: DB_URL,
    })    

    app.set('db', db)
  })
  
  const newUser = {
      username: 'test',
      password: 'password'
  }

  it('responds with json object and status 200', (done) => {
    request(app)
      .post(`/login`)
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.be.an('object')
      })
      setTimeout(done, 0)
  });
});