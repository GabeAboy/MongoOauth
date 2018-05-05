const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys')
const User = require('../models/user-model')

passport.use(
    new GoogleStrategy(
        {
            //option for google strat
            callbackURL: '/auth/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
        },
        (accessToken, refreshToken, profile, done) => {
            //passport callback funk
            console.log('profile ', profile)
            User.findOne({ googleId: profile.id })
                .then((currentUser) => {
                    if (currentUser) {
                        //Already have a user
                        console.log('user already exists', currentUser)
                    }
                    else {
                        //Don't have a user
                        new User({
                            userName: profile.displayName,
                            googleId: profile.id
                        })
                            .save()
                            .then((newUser) => {
                                console.log('new user created ', newUser)
                            })
                    }
                })
        })
);

// option for the google strat