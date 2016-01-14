/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var passport = require('passport');
module.exports = {
    'new': function(req, res) {
        //res.local.flash =_.clone(req.session.flash);
        res.view();
        //res.session.flash={};
    },
    create: function(req, res, next) {
        User.create(req.params.all(), function userCreated(err, user) {
            if (err) {
                console.log(err);
                req.session.flash = {
                        err: err
                    }
                    //res.json(err);
                return res.redirect('/user/new/');
            }
            //res.json(user);
            //res.session.flash={};
            res.redirect('/user/show/' + user.id);
        });
    },
    show: function(req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            //res.view('helo');
            if (err) return next(err);
            if (!user) return next();
            res.view({
                user: user
            });
        });
    },
    index: function(req, res, next) {
        User.find(function foundUsers(err, users) {
            if (err) return next(err);
            res.view({
                user: users
            });
        });
    },
    edit: function(req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) return next(err);
            if (!user) return next();
            res.view({
                user: user
            });
        });
    },
    update: function(req, res, next) {
        //console.log(req.param('name'));
        User.update(req.param('id'), req.params.all(), function userUpadated(err) {
            if (err) {
                return res.redirect('/user/edit/' + req.param('id'));
            }
            //console.log(req.param('name'));
            //res.json(req.params.all());
            res.redirect('/user/show/' + req.param('id'));
        });
    },
    destroy: function(req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) return next(err);
            if (!user) return next('user doesn\'t exists');
            User.destroy(req.param('id'), function userDestroy(err) {
                if (err) return next(err);
            });
            res.redirect('/user');
        });
    },
    login: function(req, res) {
        res.view();
    },
    logout: function(req, res) {
        req.session.user = null;
        req.session.flash = 'You have logged out';
        res.redirect('user/login');
    },
    'facebook': function(req, res, next) {
        passport.authenticate('facebook', {
            scope: ['public_profile']
        }, function(err, user) {
            console.log("User:", user);
            req.logIn(user, function(err) {
                if (err) {
                    req.session.flash = 'There was an error';
                    res.redirect('user/login');
                } else {
                    req.session.user = user;
                    res.redirect('/user/dashboard');
                }
            });
        })(req, res, next);
    },
    'facebook/callback': function(req, res, next) {
        passport.authenticate('facebook', function(req, res) {
            res.redirect('/user/dashboard');
        })(req, res, next);
    },
    dashboard: function (req, res) {
    res.view();
  },
  'google':function(req,res,next){
    passport.authenticate('google',{
         scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] 
    },function(err, user) {
            console.log("User:", user);
            req.logIn(user, function(err) {
                if (err) {
                    req.session.flash = 'There was an error';
                    res.redirect('user/login');
                } else {
                    req.session.user = user;
                    res.redirect('/user/dashboard');
                }
            });
    })(req,res,next);
  },
  'google/callback': function(req, res, next) {
        passport.authenticate('google',{ failureRedirect: '/login' }, function(req, res) {
            res.redirect('/user/dashboard');
        })(req, res, next);
    },
};