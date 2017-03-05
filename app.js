var express = require('express');  
var bodyParser = require('body-parser');
var orm = require("orm");
require('./app/init.js')(express,bodyParser,__dirname,orm);
