var express = require('express');
var router = express.Router();
var path = require('path');
var env = require('dotenv').config();
const Client = require('pg').Client;
const client = (() => {
  if (process.env.NODE_ENV !== 'production') {
      return new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: false
      });
  } else {
      return new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false
            }
      });
  } })();
client.connect(); //connect to database

var passport = require('passport');
var bcrypt = require('bcryptjs');

router.get('/logout', function(req, res){
  req.logout(); //passport provide it
  res.redirect('/'); // Successful. redirect to localhost:3000/
});

function loggedIn(req, res, next) {
  if (req.user) {
    next(); // req.user exists, go to the next function (right after loggedIn)
  } else {
    res.redirect('/users/login'); // user doesn't exists redirect to localhost:3000/users/login
  }
}

function isAdmin(req, res, next) {
  console.log('User Role ', req.user.role);
  if (req.user.role === 'admin') {
    next(); // req.user exists, go to the next function (right after loggedIn)
  } else {
    res.redirect('/users/home'); // user is not admin, So redirect to localhost:3000/users/home
  }
}

router.get('/profile',loggedIn, function(req, res){
  // req.user: passport middleware adds "user" object to HTTP req object
  res.sendFile(path.join(__dirname,'..', 'public','home.html'));
});

function notLoggedIn(req, res, next) {
  if (!req.user) {
    next();
  } else {
    let prefer = req.user.prefer;
    res.redirect('/users/profile?name='+prefer);
  }
}

// localhost:3000/users/login
router.get('/login', notLoggedIn, function(req, res){
  //success is set true in sign up page
  res.sendFile(path.join(__dirname,'..', 'public','login.html'));
});

// localhost:3000/users/login
router.post('/login',
  // This is where authentication happens - app.js
  // authentication locally (not using passport-google, passport-twitter, passport-github...)
  passport.authenticate('local', { failureRedirect: 'login?message=Incorrect+credentials', failureFlash:true }),
  function(req, res,next) {
    let prefer = req.user.prefer;
    console.log("fullname: ", prefer);
    res.redirect('/users/home/?name='+prefer); // Successful. redirect to localhost:3000/users/profile
    //Will send homepage from here
});


router.get('/signup',function(req, res) {
  // If logged in, go to profile page
  // if(req.user) {
  //   let prefer = req.user.prefer;
  //   return res.redirect('/users/profile?name='+prefer);
  // }
  res.sendFile(path.join(__dirname,'..', 'public','signup.html'));
});

function createUser(req, res, next) {
  var salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);
  //'INSERT INTO users (username, password, fullname, prefer) VALUES($1, $2, $3, $4)', [req.body.username, password,req.body.fullname,req.body.prefer],
  client.query('INSERT INTO users (username,password,fullname,prefer,email,streetaddress,postcode,city,phone,role) VALUES($1, $2, $3, $4,$5,$6,$7,$8,$9,$10)',
  [req.body.username, password,req.body.fullname,req.body.prefer, req.body.email, req.body.streetaddress, req.body.postcode, req.body.city, req.body.phone, 'admin'], function(err, result) {
    if (err) {
      console.log("unable to query INSERT");
      return next(err); // throw error to error.hbs.
    }
    console.log("User creation is successful");
    res.redirect('/users/signup?message=We+created+your+account+successfully!');
  });
}

router.post('/signup', function(req, res, next) {
  client.query('SELECT * FROM users WHERE username=$1',[req.body.username], function(err,result){
    if (err) {
      console.log("sql error ");
      next(err); // throw error to error.hbs.
    }
    else if (result.rows.length > 0) {
      console.log("user exists");
      res.redirect('/users/signup?error=User+exists');
    }
    else {
      console.log("no user with that name");
      createUser(req, res, next);
    }
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/whoami', function (req, res, next) {
  console.log('whoami backend call');
  res.json({ "user": req.user.username });
});
// After login this user/home will be called
router.get('/home', loggedIn, function(req,res,next) {
  res.sendFile(path.join(__dirname,'..', 'public','home.html'));
})

// After login this user/home will be called
router.get('/info', loggedIn, function(req,res,next) {
  res.sendFile(path.join(__dirname,'..', 'public','contact.html'));
})

router.get('/contact', loggedIn, function(req,res,next) {
  client.query('select * from users where username=$1', [req.user.username], function(err,response){
    if(err){
      console.log('unable to fect the user');
      next();
    }
    res.json({"user": response.rows[0]});
  })
})

router.get('/admin', loggedIn, isAdmin, function(req,res,next){
  res.sendFile(path.join(__dirname,'..', 'public','admin.html'))
})


module.exports = router;
