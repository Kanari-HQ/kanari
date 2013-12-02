var BaseController = require("./Base"),
    View = require("../views/Base");


module.exports = BaseController.extend({
    name: "Events",
    run: function(req, res, next) {
        var v = new View(res, 'events');
        v.render({
            title: 'All Events',
            content: 'your events'
        });
    }

});