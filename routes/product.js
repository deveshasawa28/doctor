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



function loggedIn(req, res, next) {
  if (req.user) {
    next(); // req.user exists, go to the next function (right after loggedIn)
  } else {
    res.redirect('/users/login'); // user doesn't exists redirect to localhost:3000/users/login
  }
}

router.get('/profile',loggedIn, function(req, res){
  // req.user: passport middleware adds "user" object to HTTP req object
  res.sendFile(path.join(__dirname,'..', 'public','profile.html'));
});

function notLoggedIn(req, res, next) {
  if (!req.user) {
    next();
  } else {
    let prefer = req.user.prefer;
    res.redirect('/users/profile?name='+prefer);
  }
}


function createProduct(req, res, next){
  var salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);

  client.query('INSERT INTO users (username, password, fullname, prefer) VALUES($1, $2, $3, $4)', [req.body.username, password,req.body.fullname,req.body.prefer], function(err, result) {
    if (err) {
      console.log("unable to query INSERT");
      return next(err); // throw error to error.hbs.
    }
    console.log("User creation is successful");
    res.redirect('/users/login?message=We+created+your+account+successfully!');
  });
}
/** POST http://localhost:3000/products/ --> with body 
 {
    "productName": "madicin5",
    "productDes":   "it for leg pain",
    "ammount": 2
 }
 */
router.post('/', function(req, res, next) {
  client.query('SELECT * FROM users WHERE username=$1',['admin'], function(err,result){
    if (err) {
      console.log("sql error ");
      next(err); // throw error to error.hbs.
    }
    else if (result.rows.length > 0) {
      console.log("user exists", result.rows[0]);
      const userId = result.rows[0].id;
      // res.redirect('/users/signup?error=User+exists');
      client.query('INSERT INTO products (user_id, product_name, product_des, ammount) VALUES($1, $2, $3, $4)', [ userId, req.body.productName, req.body.productDes,req.body.ammount], function(err, result) {
        if (err) {
          console.log("unable to query INSERT");
          return next(err); // throw error to error.hbs.
        }
        console.log("Product creation is successful");
        res.redirect('/products/message=We+Inserted+your+product+successfully!');
      });
    }
    else {
      console.log("**** your are not autorized to add the product ****");
      res.redirect('/products/message=Unable+to+Insert+your+product+check+the+Server+log!');
    }
  });
});

// http://localhost:3000/products/productList [done]
router.get('/productList', loggedIn, function (req, res, next) {
  console.log('Yes called productList in backend.......', req.user);
  client.query('SELECT * FROM users WHERE username=$1', ['admin'], function (err, result) {
    if (err) {
      console.log("exam.js: sql error ");
      next(err); // throw error
    }
    else if (result.rows.length > 0) {
      console.log("user found so lets fetch products");
      const userId = result.rows[0].id;
      client.query('SELECT * FROM products WHERE user_id=$1', [userId], function(err,products) {
        if(err){
          console.log('unable to fetch the products from db');
          next(err);
        }else if(products.rows.length){
          console.log('TOTAL products founds for this user are :', products.rows.length)
          res.json(products.rows);
        }
      })
      
    }
    else {
      console.log("This user does not have any product");
      let username = req.user.username;
      res.redirect('/products/?message=' +"NO Products");
    }
  });
});

/** new Features */
// GET http://localhost:3000/products/ product page
router.get('/', loggedIn, function(req, res){
  // req.user: passport middleware adds "user" object to HTTP req object
  res.sendFile(path.join(__dirname,'..', 'public','products.html'));
});
module.exports = router;
