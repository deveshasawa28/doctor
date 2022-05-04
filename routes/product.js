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
const res = require('express/lib/response');



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

/** POST http://localhost:3000/products/ --> with body 
 {
    "productName": "madicin5",
    "productDes":   "it for leg pain",
    "ammount": 2
 }
 */
router.post('/products', function(req, res, next) {
  client.query('SELECT * FROM users WHERE username=$1',[req.user.username], function(err,result){
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
        res.redirect('/products');
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
  client.query('SELECT * FROM users WHERE username=$1', [req.user.username], function (err, result) {
    if (err) {
      console.log("exam.js: sql error ");
      next(err); // throw error
    }
    else if (result.rows.length > 0) {
      console.log("user found so lets fetch products");
     // const userId = result.rows[0].id;
      client.query('SELECT * FROM products', function(err,products) {
        if(err){
          console.log('unable to fetch the products from db');
          next(err);
        }else if(products.rows.length){
          console.log('TOTAL products founds for this user are :', products.rows.length)
          res.json({products: products.rows, userInfo: req.user});
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

//if a user is admin and click on order menu load the order page
router.get('/orders', [loggedIn, isAdmin], function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public','order.html'));
});

//only admin can post the order,
router.post('/orders',[loggedIn, isAdmin], function(req, res){
  //will not added orders to db as now.
  res.json({'message': 'order placed successFully'});
});

router.get('/ordersList', [loggedIn, isAdmin], function(req, res,next) {
  console.log('***** orderList fetch query');
  const query = `select t1.product_name,t2.email,
  t1.product_des,
  t1.ammount,
  t2.username,t2.streetaddress,t2.fullname,t3.qty from products t1
INNER JOIN orders t3 ON t1.product_id = t3.product_id
INNER JOIN users t2 ON t3.user_id = t2.id;`
  client.query(query,function(err,orders,next) {
    if(err) {
      console.log('Unable to fetch the oders details :', err);
      next(err);
    }
    let ordersList=[];
    if(orders.rows.length){
      orders.rows.forEach(element => {
            let temp = {};
            temp.userName = element.username;
            temp.productName = element.product_name;
            temp.product_des = element.product_des;
            temp.email = element.email;
            temp.fullname = element.fullname;
            temp.streetaddress = element.streetaddress;
            temp.qty = element.qty;
            temp.price = element.ammount;
            temp.total = element.qty * element.ammount;
            ordersList.push(temp);
      });
    }
    console.log('final orders after joins :',ordersList);
    res.json({orders: ordersList});
  })
  // client.query('SELECT * FROM ORDERS where status=$1',['t'],function(err,orders){
  //   if(err){
  //     console.log('Unable to fetch the orders and reason is :', err)
  //     next();
  //   }
  //   let orderList = [];
  //   let productIds = [];
  //   if(orders.rows.length){
  //     orders.rows.forEach((item)=> {
  //       console.log('row item', item);
  //       productIds.push(item.product_id)
  //       let temp = {};
  //       switch(item.product_id){
  //         case 1: 
  //           temp.productName = item;
  //           temp.email = 'admin@test.com';
  //           temp.qty = item.qty;
  //           temp.price = item.price;
  //           temp.total = item.qty * item.price;
  //           orderList.push(temp);
  //           break;
  //         case 2:   
  //           productName = 'disprin';
  //           temp.email = 'admin@test.com';
  //           temp.qty = item.qty;
  //           temp.price = item.price;
  //           temp.total = item.qty * item.price;
  //           orderList.push(temp);
  //           break;
  //         case 3: 
  //           temp.productName = 'madicin-1';
  //           temp.email = 'client@gmail.com';
  //           temp.qty = item.qty;
  //           temp.price = item.price;
  //           temp.total = item.qty * item.price;
  //           orderList.push(temp);
  //           break;  
  //       }
  //     });
  //   }
  //   console.log('idsssss',productIds)
  //   console.log('**** orders fetched successfully', orderList.length);
  //   res.json({orders: orderList});
  // })
  
});

router.get('/addProduct',[loggedIn,isAdmin], function(req,res,next){
  res.sendFile(path.join(__dirname,'..', 'public','addProduct.html'));
});
router.post('/placeOrder',[loggedIn], function(req,res,next){
  console.log('jdsjkdslkj',req);
  next();
})
module.exports = router;
