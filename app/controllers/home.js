var mongoose = require('mongoose'),
    Event = mongoose.model('Event')

exports.index = function(req, res) {
    var options = {}

    Event.list(options, function(err, events) {
        if (err) return res.render('500')

        res.render('home/index', {
            title: 'Kanari',
            events: events
        })
    })
}