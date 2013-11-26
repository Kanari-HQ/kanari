/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes/routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var config = require('./config')();

var pg = require('pg').native;
var dbUrl; // Set below

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
    console.log('Using config db_url');
    dbUrl = config.dbUrl;

    app.use(express.errorHandler()); // @nate: why is this only in development???
}
else {
    dbUrl = process.env.DATABASE_URL;
    if(dbUrl) {
        console.log('Using DATABASE_URL as expected');
    } else {
        // @kamlearn: how do you properly shut down the app on error???
        console.log('Sorry, there was no DATABASE_URL set on env:' + app.get('env'));
    }
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/users', user.list);

var Admin = require('./controllers/Admin');

pg.connect(dbUrl, function(err, db){
    if(err){
        console.log('Sorry, there is no postgres server running at the specified address, err:' + err);
    } else {
        var attachDB = function(req, res, next){
            req.db = db;
            next();
        };

        app.all('/admin*', attachDB, function(req, res, next){
            Admin.run(req, res, next);
        });

        http.createServer(app).listen(config.port, function(){
          console.log('Connected to database')
          console.log('Express server listening on port ' + config.port);
        });
    }
})

