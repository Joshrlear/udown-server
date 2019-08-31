# udown server-side
udown, create spontaneous events with locals.
Live site: https://udown-client.joshrlear.now.sh/

### Why I created udown
Getting back into tennis, I needed I began looking for people to play with. There are plenty of platforms like meetups and facebook groups designed to do just this, but neither are very fun and really don't encourage user commitment. What do I mean by this?

Both of these groups are designed around long term scheduling of events. You want to play tennis two weeks from next thursday Maybe... how do I know what I will be doing that far out, and honestly planning this far out turns what should be fun into a chore. I want to play now, u down?

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
