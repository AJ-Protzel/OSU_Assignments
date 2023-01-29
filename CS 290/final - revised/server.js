/*
  name: Adrien Protzel
  email: protzela@oregonstate.edu
*/
var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

var homePostData = require('./homePostData');
var contactPostData = require('./contactPostData');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('homePage', {
    pageTitle: "Proelian",
    pageDes: "Advanced Energy Technologies",
    allHomePosts: homePostData
  });
});

app.get('/contacts', function (req, res, next) {
  res.status(200).render('contactsPage', {
    pageTitle: "Contacts",
    pageDes: "Contact Us",
    allContacts: contactPostData
  });
});

app.get('/readmore/:n', function (req, res, next) {
  var n = req.params.n.toLowerCase();
  if (homePostData[n]) {
    res.status(200).render('readMorePage', {
      pageTitle: homePostData[n].snipit,
      pageDes: homePostData[n].date + " • " + homePostData[n].name,
      page: homePostData[n]
    });
  } else {
    next();
  }
});

app.post('/:n/addStory', function (req, res, next){
  var n = req.params.n.toLowerCase();
  if(req.body && req.body.title && req.body.date && req.body.name && req.body.snipit && req.body.content && req.body.link){
    console.log("adding");
    homePostData.unshift({ // push
      title: req.body.title,
      date: req.body.date,
      name: req.body.name,
      snipit: req.body.snipit,
      content: req.body.content,
      link: req.body.link
    });
    fs.writeFile(
      __dirname + '/homePostData.json',
      JSON.stringify(homePostData, 6, null),
      function (err) {
        if (!err) {
          res.status(200).send();
        } else {
          res.status(500).send("Failed to write data on server side.");
          console.log("failed");
        }
      }
    );
  } else {
    res.status(400).send("Request body needs url and caption.");
  }
});

app.get('*', function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: "404",
    pageDes: "Woops! We couldn't find that page."
  });
});

app.listen(port, function () {
  console.log("== Server listening on port", port);
})
