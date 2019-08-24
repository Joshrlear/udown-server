const knex = require('knex')
const request = require('supertest');

describe('test text-router', () => {

    before('make knex instance', () => {
      const { DB_URL } = require('../src/config')
      const db = knex({
        client: 'pg',
        connection: DB_URL,
      })    
  
      app.set('db', db)
    })

    const reqBody = { 
        'username': 'testuser', 
        'location': 'Test Location',
        'userPhones': [16195076807,16199161504]
    }

    const badReqBody = { 
        'username': 'testuser', 
        'location': 'Test Location'
    }
  
    it('responds with json object regardless of status', () => {
      request(app)
        .post(`/text`)
        .send(reqBody)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.be.an('object')
        })
    });

    it('responds with error given no user phones', () => {
      request(app)
        .post('/text')
        .send(badReqBody)
        .catch(error => {
          expect(error).to.have.deep.property('text');
          done();
        })
    })
  
    it('responds with error given no user_id', () => {
      request(app)
        .post('/text')
        .catch(error => {
          expect(error).to.have.deep.property('text');
          done();
        })
    })
  });