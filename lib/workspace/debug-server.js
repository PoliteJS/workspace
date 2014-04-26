/**
 * PoliteJS Workspace - Debug Server
 *
 * // run standard debug server on 8080
 * node server.js
 *
 * // custom port
 * node server.js 1234
 *
 * // serve release folder on 8080
 * node server.js -r
 *
 * // serve release folder on custom port
 * node server.js -r 1234
 *
 */
var http = require('http');
var path = require('path');
var fs = require('fs');

var express = require('express');

var app = express();
var server = http.createServer(app);


// dynamic settings for path and port
var TARGET = null;
var PORT = null;
var RELEASE_MODE = false;

if (process.argv[2]) {
    if (process.argv[2] === '-r') {
        TARGET = 'build/release';
    } else if (parseInt(process.argv[2]) == process.argv[2]) {
        PORT = process.argv[2];
    } else {
        TARGET = process.argv[2];
    }
}

if (process.argv[3]) {
    if (TARGET === null) {
        TARGET = process.argv[3];
    } else if (PORT === null && parseInt(process.argv[3]) == process.argv[3]) {
        PORT = process.argv[3];
    }
}

// default settings
if (TARGET === null) {
    TARGET = 'build/debug/';
}
if (PORT === null) {
    PORT = '8080';
}


// Settings
var ROOT_DIR = process.cwd();
var PUBLIC_DIR = path.join(ROOT_DIR, '' + TARGET);


// RELEASE MODE FLAG
if (TARGET.toLocaleLowerCase().indexOf('build/release') !== -1) {
    RELEASE_MODE = true;
}


// Parsing
app.use(express.bodyParser());
app.use(express.cookieParser());


// prevent cache
if (!RELEASE_MODE) {
    app.use(function(req, res, next){
        req.connection.setTimeout(500);
        res.setHeader('Last-Modified', (new Date()).toUTCString());
        req.connection.setTimeout(500);
        next();
    });
}

// static files
app.use(express.static(PUBLIC_DIR));

// fallback to features source files
app.use(function(req, res, next) {
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
    next();
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

