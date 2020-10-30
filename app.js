const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'config/.env') });

const routes = require('./routes');

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CONNECT DATABASE
mongoose
    .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected.'))
    .catch((err) => console.log(err));


// Static files 
app.use('/static', express.static('public'));

// Configure view engine 
nunjucks.configure('views', {
    autoescape: true,
    watch: true,
    express: app
});

app.use('/', routes);


module.exports = app;

