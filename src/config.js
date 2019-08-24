const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://josh-lear:password@localhost/udown',
  GOOGLE_PLACES_API: process.env.GOOGLE_PLACES_API,
  GOOGLE_PLACES_ENDPOINT: process.env.GOOGLE_PLACES_ENDPOINT,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  NEXMO_ENDPOINT: process.env.NEXMO_ENDPOINT,
  NEXMO_API_KEY: process.env.NEXMO_API_KEY,
  NEXMO_API_SECRET: process.env.NEXMO_API_SECRET
}
