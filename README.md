# udown server-side
udown, create spontaneous events with locals.
Live site: https://udown-client.joshrlear.now.sh/

### Why I created udown
“Originally, I wanted to play tennis 
with someone near me. Not knowing
anyone who played, I was forced
to use things like meetups and
facebook groups.

Meetups are great for people who
love scheduling their lives a 
month out, but that’s just not 
me. Facebook groups are good
for finding people with similar
interest to chat with but it lacks
the push you sometimes need
to actually go do these things
with strangers, you know? 
Also, there’s no garauntee that 
these people are near you.

So much technology has been
created to bring us together 
online but there really isn’t 
anything that brings us 
together in the real world... 
so I built it.”

### How does udown work?
Currently, the app is limited to login/signup auth using passport, searching query with google maps and places api, viewing info on locations based on query and which marker the user clicked on, sending text notifications to invite users to join their event using nexmo api and finally, a chat feature that allows users to chat in real-time using socket.io.

The Basic functionality is there but I am currently working hard to improve loading speeds, customizations and features, as well as animations and design.

See this short video that shows a demo of login, query search and display, sending texts and the chat functionality: https://youtu.be/B_JTZHo4pgs


#### Current status
deployed in beta v1.0

#### API/Packages/Frameworks used
language: javascript
styling: scss
Front-end: React
Back-end: Nodejs, express
Database: PostgreSQL, knex
Platform: Heroku, zeit
other notable packages and api:
Google maps/places API, Nexmo API, socket.io, passport to name a few.