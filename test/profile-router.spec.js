const knex = require('knex')
const request = require('supertest');

describe('getting profile', () => {

  before('make knex instance', () => {
    const { DB_URL } = require('../src/config')
    const db = knex({
      client: 'pg',
      connection: DB_URL,
    })    

    app.set('db', db)
  })

  it('user not logged in, responds with status error', () => {
    return request(app)
      .get(`profile/1`)
      .set('Accept', 'application/json')
      .set('user_id', '1')
      .catch(err => {
        expect(err)
      })
  });
});