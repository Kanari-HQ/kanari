/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
    , events = require('../app/controllers/events')
    , auth = require('./middlewares/authorization')
    , home = require('../app/controllers/home')

/**
 * Route middlewares
 */

var eventAuth = [auth.requiresLogin, auth.event.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    // user routes
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session)
    app.get('/users/:userId', users.show)
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: [ 'email', 'user_about_me'],
            failureRedirect: '/login'
        }), users.signin)
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/github',
        passport.authenticate('github', {
            failureRedirect: '/login'
        }), users.signin)
    app.get('/auth/github/callback',
        passport.authenticate('github', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/twitter',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }), users.signin)
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/google',
        passport.authenticate('google', {
            failureRedirect: '/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin)
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/linkedin',
        passport.authenticate('linkedin', {
            failureRedirect: '/login',
            scope: [
                'r_emailaddress'
            ]
        }), users.signin)
    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', {
            failureRedirect: '/login'
        }), users.authCallback)

    app.param('userId', users.user)

    // event routes
    app.get('/events', events.index)
    app.get('/events/new', auth.requiresLogin, events.new)
    app.post('/events/search', events.search)
    app.post('/events', auth.requiresLogin, events.create)
    app.get('/events/:id', events.show)
    app.get('/events/:id/edit', eventAuth, events.edit)
    app.put('/events/:id', eventAuth, events.update)
    app.del('/events/:id', eventAuth, events.destroy)

    app.param('id', events.load)

    // home route
    app.get('/', home.index)

    // comment routes
//    var comments = require('../app/controllers/comments')
//    app.post('/events/:id/comments', auth.requiresLogin, comments.create)
//    app.get('/events/:id/comments', auth.requiresLogin, comments.create)

    // tag routes
//    var tags = require('../app/controllers/tags')
//    app.get('/tags/:tag', tags.index)

}
