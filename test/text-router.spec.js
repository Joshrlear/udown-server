const knex = require('knex')
const request = require('supertest')
const app = require('../src/app')

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
        'users': [16195076809,16199161508]
    }
  
    it('responds with json object and status 200', () => {
      return request(app)
        .post(`/text`)
        .send(reqBody)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(200)
        })
    });
  });