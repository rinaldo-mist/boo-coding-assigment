'use strict';

const express = require('express');
// const { connect } = require('./config/db');
const app = express();
// const port =  process.env.PORT || 3000;

// app use json
app.use(express.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/', require('./routes/profile')());

module.exports = app;

// start server
// connect().then(() => {
//     try {
//         const server = app.listen(port);
//         console.log('Express started. Listening on %s', port);
//     } catch (err) {
//         console.log('error connecting to database...')
//     }
// }).catch(err => {
//     console.error('invalid database connection...'+ err);
// })
