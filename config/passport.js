var mongoose = require('mongoose')
    , LocalStrategy = require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GitHubStrategy = require('passport-github').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , LinkedinStrategy = require('passport-linkedin').Strategy
    , SoundCloudStrategy = require('passport-soundcloud').Strategy
    , User = mongoose.model('User')


module.exports = function (passport, config) {
    // require('./initializer')

    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user)
        })
    })

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) { return done(err) }
                if (!user) {
                    return done(null, false, { message: 'Unknown user' })
                }
                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid password' })
                }
                return done(null, user)
            })
        }
    ))


    // Use the SoundCloudStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and SoundCloud
    //   profile), and invoke a callback with a user object.

    var SOUNDCLOUD_CLIENT_ID = "eb18042421926b47147cf70702d6c5f7";
    var SOUNDCLOUD_CLIENT_SECRET = "c49e63c42858a92d5e5a07c85fed49ca";
    passport.use(new SoundCloudStrategy({
        clientID: SOUNDCLOUD_CLIENT_ID,
        clientSecret: SOUNDCLOUD_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/soundcloud/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          
          // To keep the example simple, the user's SoundCloud profile is returned
          // to represent the logged-in user.  In a typical application, you would
          // want to associate the SoundCloud account with a user record in your
          // database, and return that user instead.
          return done(null, profile);
        });
      }
    ));


    // use twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({ 'twitter.id': profile.id }, function (err, user) {
                if (err) { return done(err) }
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        provider: 'twitter',
                        twitter: profile._json
                    })
                    user.save(function (err) {
                        if (err) console.log(err)
                        return done(err, user)
                    })
                }
                else {
                    return done(err, user)
                }
            })
        }
    ))

    // use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                if (err) { return done(err) }
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'facebook',
                        facebook: profile._json
                    })
                    user.save(function (err) {
                        if (err) console.log(err)
                        return done(err, user)
                    })
                }
                else {
                    return done(err, user)
                }
            })
        }
    ))

    // use github strategy
    passport.use(new GitHubStrategy({
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ 'github.id': profile.id }, function (err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'github',
                        github: profile._json
                    })
                    user.save(function (err) {
                        if (err) console.log(err)
                        return done(err, user)
                    })
                } else {
                    return done(err, user)
                }
            })
        }
    ))

    // use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ 'google.id': profile.id }, function (err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'google',
                        google: profile._json
                    })
                    user.save(function (err) {
                        if (err) console.log(err)
                        return done(err, user)
                    })
                } else {
                    return done(err, user)
                }
            })
        }
    ));

    

    // use linkedin strategy
    passport.use(new LinkedinStrategy({
            consumerKey: config.linkedin.clientID,
            consumerSecret: config.linkedin.clientSecret,
            callbackURL: config.linkedin.callbackURL,
            profileFields: ['id', 'first-name', 'last-name', 'email-address']
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ 'linkedin.id': profile.id }, function (err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName
                        , email: profile.emails[0].value
                        , username: profile.emails[0].value
                        , provider: 'linkedin'
                    })
                    user.save(function (err) {
                        if (err) console.log(err)
                        return done(err, user)
                    })
                } else {
                    return done(err, user)
                }
            })
        }
    ));
}
