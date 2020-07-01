const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//user model
const User = require('../models/User');
module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done) =>{
            //Match usern
            User.findOne({email:email})
            .then(user => {
                if(!user) {
                    return done(null,false,{message: 'User not found'});
                }
                //match the password

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message: 'Password does not match'});
                    }
                });
            })
            .catch(err => console.log(err))
        }),
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}