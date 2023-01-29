/*
  name: Adrien Protzel
 email: protzela@oregonstate.edu
 https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500
*/

var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var postData = require('./postData');
var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('homePage', {postAll: postData});
});

app.get('/posts/:item', function (req, res, next) {
  var item = req.params.item;
  item = parseInt(item, 10);
  if (Number.isInteger(item) && item <= 7 && item >= 0) {
    res.status(200).render('homePage', {posts: postData[item]});
  } else {
    next();
  }
});

app.get('*', function (req, res, next) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server listening on port", port);
})
