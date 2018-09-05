const express = require('express');
const passport = require('passport');
const axios = require('axios');
const authRouter = require('express').Router();
const clientUrl = 'http://localhost:4000'; // http://18.222.219.218:4000/
const INSTAGRAM_CLIENT_ID = require('../../config').INSTAGRAM_CLIENT_ID;
const INSTAGRAM_SECRET = require('../../config').INSTAGRAM_SECRET;
const InstagramStrategy = require('passport-instagram').Strategy;
const FACEBOOK_APP_ID = require('../../config').FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = require('../../config').FACEBOOK_APP_SECRET;
const FacebookStrategy = require('passport-facebook').Strategy;
const userDB = require('../../databases/Users.js');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new InstagramStrategy({
  clientID: INSTAGRAM_CLIENT_ID,
  clientSecret: INSTAGRAM_SECRET,
  callbackURL: '/auth/instagram/callback'
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      console.log(accessToken)
      console.log(profile)
      return done(null, {profile: profile, accessToken: accessToken})})
  }
));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos']
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(() => {
    return done(null, {profile: profile, accessToken: accessToken})})
}))
  

authRouter.get('/instagram',
  passport.authenticate('instagram')
);

authRouter.get('/facebook',
  passport.authenticate('facebook', {scope: ['user_photos']})
);


authRouter.get('/instagram/callback',
  passport.authenticate('instagram', {successRedirect: '/insta', failureRedirect: '/'}),
  (req, res) => {res.redirect('/')}
);

authRouter.get('/facebook/callback',
  passport.authenticate('facebook', {successRedirect: '/fb', failureRedirect: '/'}),
  (req, res) => {
    res.redirect('/')
  }
);

authRouter.get('/current_user', (req, res) => {
  if (req.user !== undefined) {
    req.session.accessToken = req.user.accessToken;
    req.session.profile = req.user.profile;
    let username;
    if (req.user.profile.username) {
      username = req.user.profile.username;
    } else {
      username = req.user.profile.displayName;
    }
    console.log('username is', username);
    userDB.getUser(username, (err, data) => {
      if (err) {
        console.log("Error Saving User", err)
      } else if (data === null) {
        userDB.saveUser(username);
      }
    });
    res.send(username);
  } else {
    res.send('');
  }
});

authRouter.get('/media', (req, res) => {
  axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${req.user.accessToken}`)
  .then(({data}) => {
    let urls = data.data.map((image) => {
      return image.images.low_resolution.url;
    })
    res.status(200).send(urls);
  })
  .catch((err) => {console.log(err)})
});

authRouter.get('/fbmedia', (req, res) => {
  axios.get(`https://graph.facebook.com/${req.user.profile.id}/photos?type=uploaded&fields=images&access_token=${req.user.accessToken}`)
  .then((response)=> {
    console.log(response.data.data);
    let urls = response.data.data.map((image) => {
      return image.images[0].source;
    })
    res.status(200).send(urls);
  }).catch((err) => {
    console.log(err)
  })
})

authRouter.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});


module.exports = authRouter;