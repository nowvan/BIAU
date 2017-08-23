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

router.post('/uploadfile', function(req, res) {

	
	//檔案存入路徑
	var path = '../public/uploads/'+ req.session.companyname;
	fs.mkdir(path, function (err) {
		if (err) {
			console.log('failed to create directory', err);
		} 
	});
	//multer儲存資訊
	var storage = multer.diskStorage({
		destination : function(req, file, callback) {
			callback(null, path);
		},
		filename : function(req, file, callback) {
			var fileFormat = (file.originalname).split(".");
			 console.log(fileFormat);
			var originalname = file.originalname.slice(0,
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
		//res.redirect("https://ipfs.io/ipfs/QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB");
		console.log('File Uploaded');
		
		
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
		
		
		
		//寫入智能合約
		///////////////////////////////////////////////////////////////
		var ethereumUri = 'http://localhost:8545';
		var web3 = new Web3();
		var eth = web3.eth;
		web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
		
		function contractControl(producecontract, eth) {
			
			var txHash = producecontract.putFileInfo(req.session.companyname,req.file.originalname,"hash","怎麼會這樣!!",
			        {
						from: eth.accounts[0],
						gas: 3141592
					});
			      
			console.log('txHash is : ' + txHash);
			console.log('檔案以上傳  ');
			
		}

		var producecontract = web3.eth.contract(
				[{"constant":true,"inputs":[{"name":"company","type":"string"}],"name":"getFileInfo","outputs":[{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"BIAU","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"company","type":"string"},{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"name":"putFileInfo","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"isBIAU","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"company","type":"string"},{"indexed":false,"name":"filename","type":"string"},{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"newest","type":"string"}],"name":"fileUploadEvent","type":"event"}]
				).at("0xfd59d3ffa49c3b290af84b418601abecc817eceb");

		contractControl(producecontract, eth);
		///////////////////////////////////////////////////////////////

		
		
	});
	

});

module.exports = router;