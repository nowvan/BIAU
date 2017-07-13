var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var Web3 = require('web3');
var http = require('http');
var https = require('https');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

const ethereumUri = 'http://localhost:8545';
var web3 = new Web3();
var eth = web3.eth;
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

//////////////////////////////////////////
var producecontract = web3.eth.contract(
		[
			  {
			    "constant": false,
			    "inputs": [],
			    "name": "isCompany",
			    "outputs": [
			      {
			        "name": "",
			        "type": "bool"
			      }
			    ],
			    "payable": false,
			    "type": "function"
			  },
			  {
			    "constant": false,
			    "inputs": [
			      {
			        "name": "filename",
			        "type": "string"
			      },
			      {
			        "name": "url",
			        "type": "string"
			      }
			    ],
			    "name": "putFile",
			    "outputs": [],
			    "payable": false,
			    "type": "function"
			  },
			  {
			    "constant": true,
			    "inputs": [],
			    "name": "company",
			    "outputs": [
			      {
			        "name": "",
			        "type": "address"
			      }
			    ],
			    "payable": false,
			    "type": "function"
			  },
			  {
			    "inputs": [],
			    "payable": false,
			    "type": "constructor"
			  },
			  {
			    "anonymous": false,
			    "inputs": [
			      {
			        "indexed": false,
			        "name": "from",
			        "type": "address"
			      },
			      {
			        "indexed": false,
			        "name": "Filename",
			        "type": "string"
			      },
			      {
			        "indexed": false,
			        "name": "Url",
			        "type": "string"
			      }
			    ],
			    "name": "dataSet",
			    "type": "event"
			  }
			]).at("0x31fa3965dc8a7d5f226498f98fe1839a10c35ac8")


 //以 eth.contract 參照 ABI 製造出合約正本


contractControl(producecontract, eth);



function contractControl(producecontract, eth) {

// 當 simplgestorage 的 setEvent 被發射的時候，就會被如此接住
producecontract.dataSet({}, function(err, eventdata) {
console.log('dataSet fired : ');
console.log(eventdata.args);
console.log("START DONLOAD");

///////////////////
//var httpClient = eventdata.args.Url.slice(0, 5) === 'https' ? https : http;
//var writer = fs.createWriteStream(localFile);
//writer.on('finish', function() {
//  callback(localFile);
//});
//httpClient.get(eventdata.args.Url, function(response) {
//  response.pipe(writer);
//});

////////////////
})
//////////////////////////////////////////
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
