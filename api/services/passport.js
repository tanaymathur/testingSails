var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function findById(id, fn) {
  User.findOne(id,function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByFacebookId(id, fn) {
  User.findOne({
    facebookId: id
  },function (err, user) {
    if (err) {console.log("Error:",err);
      return fn(null, null);
    } else {
      //console.log("\nid:",id,"##",user);
      return fn(null, user);
    }
  });
}
function findByGoogleId(id, fn) {
  console.log("Id:",id);
  User.findOne({
    googleId: id
  },function (err, user) {
    if (err) {console.log("Error:",err);
      return fn(null, null);
    } else {
      //console.log("\nid:",id,"##",user);
      return fn(null, user);
    }
  });
}


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: "1549103212047194",
    clientSecret: "800ffa9ce020b5a20b10441ee3d7dff6",
    callbackURL: "http://www.selfiesport.in:1337/user/facebook/callback",
    profileFields: ['id','name','email','photos','gender','profileUrl',"age_range"],
    enableProof: false
  }, function (accessToken, refreshToken, profile, done) {
    console.log("profile: ", profile);
    findByFacebookId(profile.id, function (err, user) {
       //console.log("\nUser:",user);
      // Create a new User if it doesn't exist yet
      if (!user) {
        User.create({

          facebookId: profile.id

          // You can also add any other data you are getting back from Facebook here 
          // as long as it is in your model

        },function (err, user) {
          if (user) {
            return done(null, user, {
              message: 'Logged In Successfully'
            });
          } else {
            return done(err, null, {
              message: 'There was an error logging you in with Facebook'
            });
          }
        });

      // If there is already a user, return it
      } else {
        console.log("Logged In Successfully");
        return done(null, user, {
          message: 'Logged In Successfully'
        });
      }
    });
  }
));
passport.use(new GoogleStrategy({
    clientID: '805987247796-g3ajb920lbi3j4r8p54c33ld9fdm0gqs.apps.googleusercontent.com',
    clientSecret: 'RTRLkiE6E9SccO3xGzjMK3IO',
    callbackURL: "http://www.selfiesport.in:1337/user/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile:",profile);
       findByGoogleId(profile.id, function (err, user) {
       console.log("stra:",user);
      // Create a new User if it doesn't exist yet
      if (!user) {
        User.create({

          googleId: profile.id

          // You can also add any other data you are getting back from Facebook here 
          // as long as it is in your model

        },function (err, user) {console.log("Error:",err);
          if (user) {
            return done(null, user, {
              message: 'Logged In Successfully'
            });
          } else {
            return done(err, null, {
              message: 'There was an error logging you in with Facebook'
            });
          }
        });

      // If there is already a user, return it
      } else {
        console.log("Logged In Successfully");
        return done(null, user, {
          message: 'Logged In Successfully'
        });
      }
    });
  }
));