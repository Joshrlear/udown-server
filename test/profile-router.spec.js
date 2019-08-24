const knex = require('knex')
const request = require('supertest');

describe('getting profile images', () => {

  before('make knex instance', () => {
    const { DB_URL } = require('../src/config')
    const db = knex({
      client: 'pg',
      connection: DB_URL,
    })    

    app.set('db', db)
  })

  it('responds with json object and status 200', (done) => {
    request(app)
      .get(`/login`)
      .set('Accept', 'application/json')
      .set('user_id', '1')
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.be.an('object')
      })
      setTimeout(done, 0)
  });

  it('responds with error given no user_id', () => {
    request(app)
      .get('/login')
      .set('Accept', 'application/json')
      .catch(error => {
        expect(error).to.have.deep.property('text').to.contain('No user id specified');
        done();
      })
  })
});

describe('getting user phone number', () => {

  before('make knex instance', () => {
    const { DB_URL } = require('../src/config')
    const db = knex({
      client: 'pg',
      connection: DB_URL,
    })    

    app.set('db', db)
  })

  it('responds with json object regardless of status', () => {
    request(app)
      .get(`/1/phone_number`)
      .set('Accept', 'application/json')
      .set('user_id', '1')
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.be.an('object')
      })
  });

  it('responds with error given no user_id', () => {
    request(app)
      .get('/0/phone_number')
      .set('Accept', 'application/json')
      .catch(error => {
        expect(error).to.have.deep.property('text').to.contain('No user id specified');
        done();
      })
  })
});