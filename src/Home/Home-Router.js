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
        const textSearch = "free tennis court in san diego"
        const location = "32.8180,-117.0560"
        const radius = 24000
        request({
            uri: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${textSearch}&location=${location}&radius=${radius}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        })
        .pipe(res)
        console.log('working')
    })


// This router should be all good but I am receiving a 403 unauthorized error saying
// that I have met my quota indicated by the icon in the Network > preview
// I don't seem to have exceeded anyb quota when looking on google cloud console
// I have contacted sales to ask about it... consider removing photos for now.
homeRouter
    .post('/location-photo', async (req, res, next) => {
        console.log('home_router /location-photo request is running')
        const { photo, width } = req.headers
        console.log('photo:', photo, 'width:', width)
        console.log(config.GOOGLE_PLACES_API)
        const response = await fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAuR9t_a1xlGZ4DhTsADEa4Rs5TtH9418G1L13Jvw3jAminv9eGbXqOaID-9hcHaeQdDJc4BsR46pK6_is-OYhyPsA3jp0s6BNshjC71J0HyMyqePcwjuUQZhT4XYHDjceEhAln63uP89neZmxYLBu_0JNGhRkRyWt94ut4zEbp-PQWR6N-sKPGA&key=AIzaSyA791_vzW7k9sk4W4jli9JqaXxLmPk1Y6A')
            .then(res => { return res.url })
        res.send(response)
    })
        

module.exports = homeRouter

