/**
 * Created by zsiri on 2016.12.05..
 */

import * as express from "express";
import * as bodyParser from "body-parser";
import * as socketIo from "socket.io";
import {defineRoutes} from './routes/index';
import {defineIoInteractions} from "./routes/io";

// The main server with express
var app = express();

// Body parser module, to interpret the body of the post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// use the public directory to serve files without parsing it
app.use(express.static(__dirname+'/public'));

// mongo
var dbConfig = require('./configs/database');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);

// add uri routes
var router = express.Router();
var routes = defineRoutes(router);
app.use('/', routes);


// set port if it is not set
app.set('port', process.env.PORT || 3000);

// start the server
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

// add IO interactions
var io = socketIo.listen(server);
io = defineIoInteractions(io);
