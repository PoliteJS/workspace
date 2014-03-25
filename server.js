/**
 * PoliteJS Workspace - Debug Server
 */
var http = require('http');
var path = require('path');
var fs = require('fs');

var express = require('express');

var app = express();
var server = http.createServer(app);

// Settings
var PORT = process.argv[2] ? parseInt(process.argv[2], 10) : 8080;
var TARGET = process.argv[3] || 'build/debug/';
var ROOT_DIR = __dirname;
var PUBLIC_DIR = path.join(ROOT_DIR, '' + TARGET);

// Parsing
app.use(express.bodyParser());
app.use(express.cookieParser());


// prevent cache
app.use(function(req, res, next){
    req.connection.setTimeout(500);
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	req.connection.setTimeout(500);
	next();
});

// static files
app.use(express.static(PUBLIC_DIR));

// fallback to features source files
app.use(function(req, res) {
    var uri = '';
	if (req.url.indexOf('/node_modules/') !== -1) {
		uri = 'src/features' + req.url.substr(req.url.indexOf('/node_modules/')+13, req.url.length);
	}
    if (req.url.indexOf('/build/debug/') !== -1) {
        uri = 'src/' + req.url.substr(req.url.indexOf('/build/debug/')+13, req.url.length);   
    }
    if (req.url.indexOf('/src/') !== -1) {
        uri = req.url.substr(req.url.indexOf('/src/'), req.url.length);   
    }
    if (uri.length) {
        fs.readFile(path.join(ROOT_DIR, uri), 'utf8', function (err, data) {
			if (!err) {
				res.status(200).send(data);
			}
			else {
				res.status(500).send(err);
			}
		});
    }
});

// fallback to index.html
app.use(function (req, res) {
	fs.readFile(path.join(PUBLIC_DIR, 'index.html'), 'utf8', function (err, data) {
		if (!err) {
			res.status(200).send(data);
		}
		else {
			res.status(500).send(err);
		}
	});
});



// Start
server.listen(PORT);
console.log(' ');
console.log('======= PoliteJS Workspace ========');
console.log('Just open your Chrome and point to:');
console.log('http://localhost:%s', PORT);
console.log('===================================');

