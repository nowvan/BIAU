var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var Web3 = require('web3');
var request = require('request');

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

var company = "van";

const ethereumUri = 'http://localhost:8545';
var web3 = new Web3();
var eth = web3.eth;
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

//////////////////////////////////////////
var producecontract = web3.eth.contract(
		[{"constant":true,"inputs":[{"name":"company","type":"string"}],"name":"getFileInfo","outputs":[{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"BIAU","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"company","type":"string"},{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"name":"putFileInfo","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"isBIAU","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"company","type":"string"},{"indexed":false,"name":"filename","type":"string"},{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"newest","type":"string"}],"name":"fileUploadEvent","type":"event"}]
		).at("0x34776ae81d5ce7062fb80fca21e0b059feed8eda")


 //以 eth.contract 參照 ABI 製造出合約正本


contractControl(producecontract, eth);



function contractControl(producecontract, eth) {

// 當 simplgestorage 的 setEvent 被發射的時候，就會被如此接住

producecontract.fileUploadEvent({}, function(err, eventdata) {
	
	
	
	console.log('dataSet fired : ');
	console.log(eventdata.args);
	if(company === eventdata.args.company){
		console.log("START DONLOAD");


///////////////////
		function downloadFile(url,filename,callback){
			var stream = fs.createWriteStream(filename);
			request(url).pipe(stream).on('close', callback); 
		}

		var fileUrl  = eventdata.args.url;
		var fileName = eventdata.args.filename;
		downloadFile(fileUrl,fileName,function(){
			console.log(fileName+'下载完毕');
		});
	}

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
