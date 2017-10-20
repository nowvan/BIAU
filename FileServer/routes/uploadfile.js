/*jshint esversion: 6 */
/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */
require('../lib/db');
var express = require('express');
var multer = require('multer');
var router = express.Router();
var mongoose = require('mongoose');
var File = mongoose.model('File');
var DFile = mongoose.model('DFile');
var Logindata = mongoose.model('Logindata');
var fs = require('fs');
var Web3 = require('web3');
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

var node;
var hashToPass;
var fileToAdd;
var contractAddr = "0xc11dceaa52790acc593e72bc7b033f943eefc6d9";




//**IPFS功能
//產生IPFS節點
const repoPath = 'server';
node = new IPFS({
	init: true,
	repo: repoPath
});
//啟動IPFS節點
node.on('start', () => {});
//IPFS上傳函式
function ipfsUpload (err) {
	  if (err) {
	    throw err;
	  }
	  node.start(() => {
		  node.files.add(fileToAdd, function (err, res) {
			  if (err || !res) {
				  return console.error('Error - ipfs files add', err, res);
			  }
			  res.forEach(function (file) {
				  hashToPass = file.hash;
				  //console.log('successfully stored', file);
				  //console.log(hashToPass);
			  });
		  });
	  });
}


//**express
router.post('/uploadfile', function(req, res) {	
	//檔案存入路徑
	var path = '../public/uploads/'+ req.session.companyname;
	fs.mkdir(path, function (err) {
		if (err) {
			console.log('failed to create directory', err);
		} 
	});
	//multer儲存資訊
	var originalname;
	var storage = multer.diskStorage({
		destination : function(req, file, callback) {
			callback(null, path);
		},
		filename : function(req, file, callback) {
			var fileFormat = (file.originalname).split(".");
			 //console.log(fileFormat);
			 originalname = file.originalname.slice(0,
					(fileFormat[fileFormat.length - 1].length + 1) * -1);
			callback(null, originalname + '-' + Date.now() + "."+ fileFormat[fileFormat.length - 1]);
		}
	});
	var upload = multer({
		storage : storage
	}).single('uploadfile');
	console.log(req.session.companyname);
	// console.log(req);
	// console.log(Date.now());
	if (!req.session.companyname) {
		res.redirect('/');
		return;
	}
	upload(req, res, function(err) {		
		if (err) {
			console.log('Error Occured');
			return;
		}
		if (!req.file) {
			res.redirect('/');
			return;
		}
		console.log(req.file);
		res.redirect('/users/uploadssuccess');
		console.log('file uploaded');	
		//設定IPFSADD路徑
		fileToAdd = {
			  path: originalname ,
			  content: fs.createReadStream(req.file.path)
		};
		//console.log(path);
		//console.log(originalname);
		//呼叫IPFS上傳函式
		ipfsUpload();
		//寫入資料庫(檔案資訊)
		new File({
			Companyname : req.session.companyname,
			Originalname : req.file.originalname,
			Filename : req.file.filename,
			CreateDate : Date.now()
		}).save(function(err) {
			if (err) {
				console.log('Fail to save to DB.');
				return;
			}
			console.log('Save to DB.');
			});
		//將檔案資訊寫入智能合約
		setTimeout(function(){	
			const ethereumUri = 'http://localhost:8545';
			var web3 = new Web3();
			var eth = web3.eth;
			
			web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
			function contractControl(producecontract, eth) {	
				var txHash = producecontract.putFileInfo(req.session.companyname,req.file.originalname,hashToPass,"備註",
				        {
							from: eth.accounts[0],
							gas: 3141592
						});
				//console.log('txHash is : ' + txHash);
				console.log('upload to blockchain');
			}
	
			var producecontract = web3.eth.contract(
					[{"constant":true,"inputs":[{"name":"company","type":"string"}],"name":"getFileInfo","outputs":[{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"BIAU","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"company","type":"string"},{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"name":"putFileInfo","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"isBIAU","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"company","type":"string"},{"indexed":false,"name":"filename","type":"string"},{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"newest","type":"string"}],"name":"fileUploadEvent","type":"event"}]
					).at(contractAddr);			
			contractControl(producecontract, eth);
			
		},6000);//endsettime	
	});
});

module.exports = router;