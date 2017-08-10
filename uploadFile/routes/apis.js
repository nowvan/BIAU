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
		console.log('File Uploaded');
		//寫入資料庫
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
		const ethereumUri = 'http://localhost:8545';
		var web3 = new Web3();
		var eth = web3.eth;
		web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

		var producecontract = web3.eth.contract(
				[{"constant":true,"inputs":[{"name":"company","type":"string"}],"name":"getFileInfo","outputs":[{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"BIAU","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"company","type":"string"},{"name":"filename","type":"string"},{"name":"url","type":"string"},{"name":"newest","type":"string"}],"name":"putFileInfo","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"isBIAU","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"company","type":"string"},{"indexed":false,"name":"filename","type":"string"},{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"newest","type":"string"}],"name":"fileUploadEvent","type":"event"}]
				).at("0x249cd5b06cdf2f43e2c23acd96236f009924db5b")


		
		contractControl(producecontract, eth);
		function contractControl(producecontract, eth) {
			
			var txHash = producecontract.putFileInfo(req.session.companyname,req.file.originalname,req.file.filename,"怎麼會這樣!!",
			        {
						from: eth.accounts[0],
						gas: 3141592
					})
			      
			console.log('txHash is : ' + txHash);
			console.log('檔案以上傳  ');
			
		//////////////////////////////////////////
		}
		//接收event
//		producecontract.fileUploadEvent({}, function(err, eventdata) {	
//			console.log('dataSet fired : ');
//			console.log(eventdata.args);
//		})

		
		
	});
	

});

/* 使用者刪除檔案功能. */
router.get('/delete/:id', function(req, res, next) {
	
	var path = '../public/uploads/'+ req.session.companyname +'/'+'delete';
	fs.mkdir(path, function (err) {
		if (err) {
			console.log('failed to create directory', err);
		} 
	});
	
	File.find({
		_id : req.params.id
	}, function(err, files, count) {
		// console.log(files);
		// console.log(__dirname.slice(0,-7) +
		// '/public/uploads/'+files[0].Filename);
		
//		fs.unlink(__dirname.slice(0, -7) + '/public/uploads/'+files[0].Companyname+'/'+ files[0].Filename, function(err) {
//			if (err) {
//				throw err;
//			} else {
//				console.log('目录删除成功');
//			}
//		});
		
		new DFile({
			Companyname : files[0].Companyname,
			Originalname : files[0].Originalname,
			Filename : files[0].Filename,
			CreateDate : files[0].CreateDate
		}).save(function(err) {
			if (err) {
				console.log('Fail to save to DB.');
				return;
			}
			console.log('Save to DB.');
		});
		
		
		fs.rename(__dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/'+ files[0].Filename, __dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/delete/'+ files[0].Filename, function(err) {
			if ( err ) {console.log('ERROR: ' + err);}
		});
		
		
		
		File.remove({
			_id : req.params.id
		}, function(err) {
			if (err) {
				console.log('Fail to delete article.');
			} else {
				console.log('Done');
			}
		});
	});

//	setTimeout(function() {
//
//		callback(null);
//		}, 1000);


	res.redirect('/users/manage');
});

router.get('/restore/:id', function(req, res, next) {
	
	
	DFile.find({
		_id : req.params.id
	}, function(err, files, count) {
		// console.log(files);
		// console.log(__dirname.slice(0,-7) +
		// '/public/uploads/'+files[0].Filename);
		
		
		new File({
			Companyname : files[0].Companyname,
			Originalname : files[0].Originalname,
			Filename : files[0].Filename,
			CreateDate : files[0].CreateDate
		}).save(function(err) {
			if (err) {
				console.log('Fail to save to DB.');
				return;
			}
			console.log('Save to DB.');
		});
		
		
		fs.rename( __dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/delete/'+ files[0].Filename , __dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/'+ files[0].Filename, function(err) {
			if ( err ) {console.log('ERROR: ' + err);}
		});
		
		
		
		DFile.remove({
			_id : req.params.id
		}, function(err) {
			if (err) {
				console.log('Fail to delete article.');
			} else {
				console.log('Done');
			}
		});
	});
	
//	function sleep(delay)
//	{
//	    var start = new Date().getTime();
//	    while (new Date().getTime() < start + delay);
//	}
//	  
//	//usage
//	//wait for 3 seconds
//	sleep(1000);

	res.redirect('/users/manage');
});




/* 使用者註冊會員功能. */
router.post('/register', function(req, res, next) {
//	if ((!req.body.companyname) || (!req.body.email) || (!req.body.passwdd)|| (!req.body.email)) {
//		res.render('users/register', {
//			message : "### 請填好資料 ###"
//		});
//		return;
//	}
//	if (req.body.passwd !== req.body.passwdd) {
//		res.render('users/register', {
//			message : "### 輸入密碼不一致  ###"
//		});
//		return;
//	}
	Logindata.find({
		Companyname : req.body.companyname
	}, function(err, logindatas, count) {
		console.log(logindatas);
		if (logindatas.length === 0) {
		
			Logindata.find({
				Username : req.body.username
			}, function(err, logindatas, count) {
				if (logindatas.length === 0) {
					new Logindata({
						Companyname : req.body.companyname,
						Email : req.body.email,
						Username : req.body.username,
						Password : req.body.password,
						CreateDate : Date.now()
					}).save(function(err) {
						if (err) {
							console.log('Logindata Fail to save to DB.');
							return;
						}
						console.log('Logindata Save to DB.');
					});
					req.session.companyname = req.body.companyname;
					req.session.username = req.body.username;
					req.session.password = req.body.password;
					req.session.logined = true;
					res.redirect('/');
				}
				else{
					req.session.logined = false;
					res.render('users/register', {
						message : "使用者名稱: " + req.body.username + " 被註冊過了喔 "
					});
				}				
			});
		} else {
			req.session.logined = false;
			res.render('users/register', {
				message : "公司名稱 : " + req.body.companyname + " 被註冊過了喔 "
			});
		}
	});
});
/* 使用者登入會員功能. */
router.post('/login', function(req, res, next) {
//	if ((!req.body.user) || (!req.body.passwd)) {
//		res.render('users/register', {
//			message : "### 請填好資料   ###"
//		});
//		return;
//	}
	
	Logindata.find({
		Username : req.body.username
	}, function(err, logindata, count) {
		console.log(logindata);
		if (logindata.length === 0) {
			req.session.logined = false;
			res.render('users/signin', {
				message : "帳號或密碼錯誤 請重新輸入 "
			});
		} else {
			if (logindata[0].Password === req.body.password) {
				req.session.companyname = logindata[0].Companyname;
				req.session.username = logindata[0].Username;
				req.session.password = logindata[0].Password;
				req.session.logined = true;
				res.redirect('/');
			} else {
				req.session.logined = false;
				res.render('users/signin', {
					message : "帳號或密碼錯誤 請重新輸入  "
				});
			}
		}
	});
});

module.exports = router;