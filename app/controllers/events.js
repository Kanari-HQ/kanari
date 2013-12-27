
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Event = mongoose.model('Event')
    , utils = require('../../lib/utils')
    , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){
    var User = mongoose.model('User')

    Event.load(id, function (err, event) {
        if (err) return next(err)
        if (!event) return next(new Error('not found'))
        req.event = event
        next()
    })
}

/**
 * List
 */

exports.index = function(req, res){
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    var perPage = 30
    var options = {
        perPage: perPage,
        page: page
    }

    Event.list(options, function(err, events) {
        if (err) return res.render('500')
        Event.count().exec(function (err, count) {
            res.render('events/index', {
                title: 'Events',
                events: events,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            })
        })
    })
}

/**
 * New event
 */

exports.new = function(req, res){
    res.render('events/new', {
        title: 'New Event',
        event: new Event({})
    })
}

/**
 * Create an event
 */

exports.create = function (req, res) {
    var event = new Event(req.body)
    event.user = req.user

    event.uploadAndSave(req.files.image, function (err) {
        if (!err) {
            req.flash('success', 'Successfully created event!')
            return res.redirect('/events/'+event._id)
        }

        res.render('events/new', {
            title: 'New Event',
            event: event,
            errors: utils.errors(err.errors || err)
        })
    })
}

/**
 * Edit an event
 */

exports.edit = function (req, res) {
    res.render('events/edit', {
        title: 'Edit ' + req.event.title,
        event: req.event
    })
}

/**
 * Update event
 */

exports.update = function(req, res){
    var event = req.event
    event = _.extend(event, req.body)

    event.uploadAndSave(req.files.image, function(err) {
        if (!err) {
            return res.redirect('/events/' + event._id)
        }

        res.render('events/edit', {
            title: 'Edit Event',
            event: event,
            errors: err.errors
        })
    })
}

/**
 * Show
 */

exports.show = function(req, res){
    res.render('events/show', {
        title: req.event.title,
        event: req.event
    })
}

/**
 * Delete an event
 */

exports.destroy = function(req, res){
    var event = req.event
    event.remove(function(err){
        req.flash('info', 'Deleted successfully')
        res.redirect('/events')
    })
}
