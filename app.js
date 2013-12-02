
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var config = require('./config/config')();

var pg = require('pg').native;
var dbUrl = config.dbUrl;

var app = express();

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
//app.get('/about', routes.about);
//app.get('/users', user.list);

// routes
var Admin = require('./controllers/Admin'),
    Events = require('./controllers/Events'),
    Users = require('./controllers/Users');




pg.connect(dbUrl, function(err, db){
    if(err){
        console.log('Sorry, there is no postgres server running at the specified address.');
    } else {
        console.log('Connected to database');
        var attachDB = function(req, res, next){
            req.db = db;
            next();
        };

        app.all('/admin*', attachDB, function(req, res, next){
            Admin.run(req, res, next);
        });


        app.all('/events*', attachDB, function(req, res, next){
            Events.run(req, res, next);
        });

        app.all('/users*', attachDB, function(req, res, next){
            Users.run(req, res, next);
        });


        http.createServer(app).listen(config.port, function(){
          console.log('Express server listening on port ' + config.port);
        });
    }
})

