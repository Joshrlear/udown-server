const express = require('express')
const { StringDecoder } = require('string_decoder')
const fetch = require('node-fetch')
const GooglePlaces = require('google-places')
const dotenv = require('dotenv')
const config = require('../config')
const request = require('request')

dotenv.config()

/* const googleMapsClient = require('@google/maps').createClient({
    key: config.GOOGLE_PLACES_API,
    Promise: Promise
  }); */

//const places = new GooglePlaces(config.GOOGLE_PLACES_API)

const homeRouter = express.Router()

//const decoder = new StringDecoder('utf8')

// google maps api
homeRouter
    .get('/map', (req, res, next) => {
        const query = req.headers.query || 'parks'
        const location = "32.8180,-117.0560"
        const radius = 24000
        request({
            uri: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${process.env.GOOGLE_PLACES_API}`,
        })
        .pipe(res)
    })


// currently everything is hardcoded. need to remove sensitive info.
// Can't send url in the resJSON.url to client
homeRouter
    .post('/location-photo', (req, res, next) => {
        const { photo, width } = req.headers
        console.log('photo:', photo, 'width:', width)
        console.log(config.GOOGLE_PLACES_API)
        fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAuR9t_a1xlGZ4DhTsADEa4Rs5TtH9418G1L13Jvw3jAminv9eGbXqOaID-9hcHaeQdDJc4BsR46pK6_is-OYhyPsA3jp0s6BNshjC71J0HyMyqePcwjuUQZhT4XYHDjceEhAln63uP89neZmxYLBu_0JNGhRkRyWt94ut4zEbp-PQWR6N-sKPGA&key=${config.GOOGLE_PLACES_API}`)
            .then(res => { return res })
            .then(resJson => {
                console.log(resJson.url)
                res.send(resJson)
            })
            .catch(err => console.log(err))
    })
        

module.exports = homeRouter

