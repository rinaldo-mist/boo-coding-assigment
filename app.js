'use strict';

const express = require('express');
const app = express();

// app use json
app.use(express.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/', require('./routes/profile')());

module.exports = app;