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
        request({
            uri: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${textSearch}&location=${location}&radius=${radius}&key=${config.GOOGLE_PLACES_API}`,
        })
        .pipe(res)
        console.log('working')







        /* const request = `https://maps.googleapis.com/maps/api/place/textsearch/xml?query=tennis+in+san+diego+ca&key=${config.GOOGLE_PLACES_API}`
        const fetch_request = await fetch(request, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .pipe(res)
        .catch() */
        //const response = await fetch_request
        //const resJson = await response.json()
        console.log(res)
        //res.send(resJson)
        //response.body._outBuffer.map(buffer => responses.push(decoder.write(buffer)))
        //console.log(response)

        /*const { GOOGLE_PLACES_ENDPOINT, GOOGLE_PLACES_API } = config
        const request = GOOGLE_PLACES_ENDPOINT.split(',')
        request.splice(1, 0, config.GOOGLE_PLACES_API)
        request.join('')
         const fetch_request = await fetch(request)
        await fetch_request.res
        console.log(res)
        return res 
        })*/
    })

module.exports = homeRouter

