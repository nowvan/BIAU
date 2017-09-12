/*jshint esversion: 6 */
/* eslint-env mocha */
/*jshint -W055 */
/* eslint max-nested-callbacks: ["error", 8] */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var Web3 = require('web3');
var request = require('request');
var router = express.Router();
const IPFS = require('ipfs');
const os = require('os');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
const dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
const bs58 = require('bs58');
const Readable = require('readable-stream');
const loadFixture = require('aegir/fixtures');
const bl = require('bl');
const isNode = require('detect-node');
const concat = require('concat-stream');
const through = require('through2');
const Buffer = require('safe-buffer').Buffer;
var adm_zip = require('adm-zip');

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
var company = "黑松";
var fileUrl;
var fileName;

var node;


/////////////////IPFS//////////////////
console.log('start');
const repoPath = 'GW2';
console.log(repoPath);
// Create an IPFS node & init
node = new IPFS({
  init: true,
  repo: repoPath
});
//Start node
node.on('start', () => {});


//////////////////////events////////////////////
var producecontract = web3.eth.contract(
		[{"constant":true,"inputs":[{"name":"company","type":"string"}],"name":"getFileInfo","outputs":[{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"BIAU","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"company","type":"string"},{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"name":"putFileInfo","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"isBIAU","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"company","type":"string"},{"indexed":false,"name":"filename","type":"string"},{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"newest","type":"string"}],"name":"fileUploadEvent","type":"event"}]
		).at("0xc8cfc2ff2445e17a81dfdbbfe8dcf67297704b04");

/////////////afterNodeInit//////////////////
function ipfsDownload (err) {
	  if (err) {
	    throw err;
	  }
	  
	  setTimeout(function(){
		  node.start(() => {
			  console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
	
			  //document.getElementById("status").innerHTML= 'Node status: ' + (node.isOnline() ? 'online' : 'offline');
		  
		  
			  //const hash = 'QmZSm2NANrdEREwhesUwU9htLdg9PZXr7tSSguBHz1ZdXR';
			  //const hash = 'QmTuneUZdjb9RA2oLHG333NtjAi9WoEPxssnarTWBFwFf8';
			  const hash = fileUrl;
			  node.files.get(hash, (err, stream) => {
				console.log(hash);
				expect(err).to.not.exist();
	    	  	  	let files = [];
	    	  		stream.pipe(through.obj((file, enc, next) => {
	    	  			file.content.pipe(concat((content) => {
	    	  				files.push({
	    	  					path: file.path,
	    	  					content: content
	    	  				});
	    	  				next();
	    	  			}));
	    	  		}, () => {
	    	  				expect(files).to.be.length(1);
	    	  				expect(files[0].path).to.be.eql(hash);
	    	  				var output = files[0].content;
	    	  				//console.log(output);
	    	  				fs.writeFile("../public/"+fileName, output, function(err) {
	    	  					if(err) {
	    	  						return console.log(err);
	    	  					}
	    	  					console.log("The file was saved!!");
	    	  				  
	    	  				 
	    	  				  //extracting archives 
	    	  				  var unzip = new adm_zip('../public/'+fileName); 
	    	  				  unzip.extractAllTo("../public/", /*overwrite*/true);
	    	  				}); 
	    	  			}));
			  });//endGet
	  	});  
	  },1500);//endsettime
}

//當 smartcontract 的 setEvent 被發射的時候，就會被如此接住
producecontract.fileUploadEvent({}, function(err, eventdata) {
	
	console.log('dataSet fired : ');
	console.log(eventdata.args);
	if(company === eventdata.args.company){
		console.log("START DONLOAD");
		fileUrl  = eventdata.args.url;
		fileName = eventdata.args.filename;
		ipfsDownload();
	}
});//end event uploadfile




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
