var BaseController = require("./Base"),
    View = require("../views/Base");


module.exports = BaseController.extend({
    name: "Users",
    run: function(req, res, next) {
        var v = new View(res, 'users');
        v.render({
            title: 'All Users',
            content: 'users'
        });
    }

});