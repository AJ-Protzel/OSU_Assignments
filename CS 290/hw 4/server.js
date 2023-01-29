/*
 * name: Adrien Protzel
 * email: protzela@oregonstate.edu
 */

var http = require('http');
var fs = require('fs');

var indexHTML;
console.log('== Reading public/index.html');
fs.readFile('public/index.html', 'utf8', function(err, data) {
  indexHTML = data;
});

var indexJS;
console.log('== Reading public/index.js');
fs.readFile('public/index.js', 'utf8', function(err, data) {
  indexJS = data;
});

var styleCSS;
console.log('== Reading public/style.css');
fs.readFile('public/style.css', 'utf8', function(err, data) {
  styleCSS = data;
});

var errorHTML;
console.log('== Reading public/404.html');
fs.readFile('public/404.html', 'utf8', function(err, data) {
  errorHTML = data;
});

var bennyJPG;
console.log('== Reading public/benny.jpg');
fs.readFile('public/benny.jpg', function(err, data) {
  bennyJPG = data;
});

var server = http.createServer(function (req, res) {
  if(req.url == '/index.html' || req.url == '/'){
    console.log('> Writing /index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(indexHTML);
    res.end();
  }

  else if(req.url == '/index.js'){
    console.log('> Writing /index.js');
    res.writeHead(200, {'Content-Type': 'text/js'});
    res.write(indexJS);
    res.end();
  }

  else if(req.url == '/style.css'){
    console.log('> Writing /style.css');
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.write(styleCSS);
    res.end();
  }

  else if(req.url == '/404.html'){
    console.log('> Writing /404.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(errorHTML);
    res.end();
  }

  else if(req.url == '/benny.jpg'){
    console.log('> Writing /benny.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.write(bennyJPG);
    res.end();
  }

  else{
    console.log('> Writing else');
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write(errorHTML);
    res.end();
  }
}); // end - var server

server.listen(3000, function () {
  console.log('== Ready on Port 3000');
});
