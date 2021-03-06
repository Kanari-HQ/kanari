
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Imager = require('imager')
    , env = process.env.NODE_ENV || 'development'
    , config = require('../../config/config')[env]
    , imagerConfig = require(config.root + '/config/imager.js')
    , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
    return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
    return tags.split(',')
}

/**
 * Event Schema
 */

var EventSchema = new Schema({
    title: {type : String, default : '', trim : true},
    event_code: {type : String, default: '', trim : true},
    user: {type : Schema.ObjectId, ref : 'User'},
    comments: [{
        body: { type : String, default : '' },
        user: { type : Schema.ObjectId, ref : 'User' },
        createdAt: { type : Date, default : Date.now }
    }],
    tags: {type: [], get: getTags, set: setTags},
    image: {
        cdnUri: String,
        files: []
    },
    createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

EventSchema.path('title').validate(function (title) {
    return title.length > 0
}, 'Event title cannot be blank')

EventSchema.path('event_code').validate(function (event_code) {
    return event_code.length > 0
}, 'Event code cannot be blank')

/**
 * Pre-remove hook
 */

EventSchema.pre('remove', function (next) {
    var imager = new Imager(imagerConfig, 'S3')
    var files = this.image.files

    // if there are files associated with the item, remove from the cloud too
    imager.remove(files, function (err) {
        if (err) return next(err)
    }, 'event')

    next()
})

/**
 * Methods
 */

EventSchema.methods = {

    /**
     * Save event and upload image
     *
     * @param {Object} images
     * @param {Function} cb
     * @api private
     */

    uploadAndSave: function (images, cb) {
        if (!images || !images.length) return this.save(cb)

        var imager = new Imager(imagerConfig, 'S3')
        var self = this

        imager.upload(images, function (err, cdnUri, files) {
            if (err) return cb(err)
            if (files.length) {
                self.image = { cdnUri : cdnUri, files : files }
            }
            self.save(cb)
        }, 'event')
    },

    /**
     * Add comment
     *
     * @param {User} user
     * @param {Object} comment
     * @param {Function} cb
     * @api private
     */

    addComment: function (user, comment, cb) {
        var notify = require('../mailer/notify')

        this.comments.push({
            body: comment.body,
            user: user._id
        })

        notify.comment({
            event: this,
            currentUser: user,
            comment: comment.body
        })

        this.save(cb)
    }

}

/**
 * Statics
 */

EventSchema.statics = {

    /**
     * Find event by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function (id, cb) {
        console.log('Event.load()')
        this.findOne({ _id : id })
            .populate('user', 'name email username')
            .populate('comments.user')
            .exec(cb)
    },

    loadByEventCode: function(event_code, cb) {
        console.log('Event.loadByEventCode()')
        this.findOne({event_code: event_code })
            .populate('user', 'name email username')
            .populate('comments.user')
            .exec(cb)
    },

    /**
     * List events
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function (options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria)
            .populate('user', 'name username')
            .sort({'createdAt': -1}) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }

}

mongoose.model('Event', EventSchema)
