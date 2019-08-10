const express = require('express')
const { StringDecoder } = require('string_decoder')
const fetch = require('node-fetch')
const GooglePlaces = require('google-places')
const config = require('../config')
const request = require('request')

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
            uri: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${textSearch}&location=${location}&radius=${radius}&key=${config.GOOGLE_MAPS_API_KEY}`,
        })
        .pipe(res)
        console.log('working')
    })


// This router should be all good but I am receiving a 403 unauthorized error saying
// that I have met my quota indicated by the icon in the Network > preview
// I don't seem to have exceeded anyb quota when looking on google cloud console
// I have contacted sales to ask about it... consider removing photos for now.
homeRouter
    .post('/location-photo', (req, res, next) => {
        console.log('home_router /location-photo request is running')
        const { photo, width } = req.headers
        console.log('photo:', photo, 'width:', width)
        console.log(config.GOOGLE_PLACES_API)
        request({
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${width}&photoreference=${photo}&key=${config.GOOGLE_PLACES_API}`
        })
        .pipe(res)
        //console.log(res)
    })

module.exports = homeRouter

