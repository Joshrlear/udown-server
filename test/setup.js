const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')

global.app = app
global.expect = expect
global.supertest = supertest