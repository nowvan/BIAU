/*jshint esversion: 6 */
/*jshint -W055 */
/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const Web3 = require('web3');
const request = require('request');
const router = express.Router();
const IPFS = require('ipfs');
const os = require('os');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
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
const adm_zip = require('adm-zip');
const md5 = require('md5');

const index = require('./routes/index');
const users = require('./routes/users');
const listfile = require('./routes/listfile');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
app.use('/file',listfile); 

const ethereumUri = 'http://localhost:8545';
const web3 = new Web3();
const eth = web3.eth;
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
const company = "nccu";
const id = "5a03cb9c8cdc8a6115485f87";
console.log(md5(id));
const contractAddr = "0x3E03C27140bA68562954FAb8dB3299d7e01b2CC4";
let node;
let fileUrl;
let fileName;


// **IPFS功能
// 建立IPFS節點
const repoPath = 'GW';
node = new IPFS({
  init: true,
  repo: repoPath,
  config: {
	    Addresses: {
	        Swarm: [
	          "/ip4/0.0.0.0/tcp/4009",
	          "/ip4/127.0.0.1/tcp/4010/ws",
	          "/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss"
	        ]
	      }
	    }
});
// 啟動IPFS節點
node.on('start', () => {});
// IPFS下載函式
function ipfsDownload (err) {
	  if (err) {
	    throw err;
	  }
	  node.start(() => {
		  const hash = fileUrl;	    
		    	node.files.get(hash, (err, stream) => {
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
			    		let output = files[0].content;
			    		fs.writeFile("../public/data/"+fileName, output, function(err) {
			    			if(err) {
			    				return console.log(err);
			    			}
			    			console.log("The file was saved!!");
			    			// 解壓縮檔案
			    			if(fileName.slice(-3) === "zip"){
			    				let unzip = new adm_zip('../public/data/'+fileName);
			    				unzip.extractAllTo("../public/data/",/*overwrite*/true);
			    				console.log("解壓縮完成");
			    			}
			    		}); 
			    	}));
		    	});// endGet
	  });  
}

// **智能合約
// 建立合約變數
const producecontract = web3.eth.contract(
		[
			  {
			    "constant": true,
			    "inputs": [
			      {
			        "name": "hash",
			        "type": "string"
			      }
			    ],
			    "name": "getFileInfo",
			    "outputs": [
			      {
			        "name": "filename",
			        "type": "string"
			      },
			      {
			        "name": "url",
			        "type": "string"
			      },
			      {
			        "name": "newest",
			        "type": "string"
			      }
			    ],
			    "payable": false,
			    "type": "function"
			  },
			  {
			    "constant": true,
			    "inputs": [],
			    "name": "BIAU",
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
			    "constant": false,
			    "inputs": [
			      {
			        "name": "hash",
			        "type": "string"
			      },
			      {
			        "name": "filename",
			        "type": "string"
			      },
			      {
			        "name": "url",
			        "type": "string"
			      },
			      {
			        "name": "newest",
			        "type": "string"
			      }
			    ],
			    "name": "putFileInfo",
			    "outputs": [],
			    "payable": false,
			    "type": "function"
			  },
			  {
			    "constant": false,
			    "inputs": [],
			    "name": "isBIAU",
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
			    "inputs": [],
			    "payable": false,
			    "type": "constructor"
			  },
			  {
			    "anonymous": false,
			    "inputs": [
			      {
			        "indexed": false,
			        "name": "hash",
			        "type": "string"
			      },
			      {
			        "indexed": false,
			        "name": "filename",
			        "type": "string"
			      },
			      {
			        "indexed": false,
			        "name": "url",
			        "type": "string"
			      },
			      {
			        "indexed": false,
			        "name": "newest",
			        "type": "string"
			      }
			    ],
			    "name": "fileUploadEvent",
			    "type": "event"
			  }
			]).at(contractAddr);
// 接收合約發送的事件
producecontract.fileUploadEvent({}, function(err, eventdata) {
	console.log(eventdata.args);
	if(md5(md5(id)+company+eventdata.args.filename+eventdata.args.url+eventdata.args.newest) === eventdata.args.hash){
		console.log("start download");
		fileUrl  = eventdata.args.url;
		fileName = eventdata.args.filename;
		setTimeout(function(){
			ipfsDownload();
		},3000);
	}
});// end event uploadfile



// **express功能
// catch 404 and forward to error handler
app.use(function(req, res, next) {
let err = new Error('Not Found');
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
