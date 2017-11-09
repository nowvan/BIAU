/* 使用者註冊會員功能. */
require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Logindata = mongoose.model('Logindata');
var nodemailer = require('nodemailer');
var md5 = require('md5');
var credentials = require('../views/users/credentials');

//創建寄信工具
var mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.pass
    }
});


router.post('/register', function(req, res, next) {

	Logindata.find({
		Companyname : req.body.companyname
		
	}, function(err, logindatas, count) {
		console.log(logindatas);
		//檢查公司名稱有沒有被註冊過  怕其他人隨意註冊公司可以去修改別人的資料
		if (logindatas.length === 0) {
		
			Logindata.find({
				Email:req.body.email
			}, function(err, logindatas, count) {
				//檢查email有沒有被註冊過
				if (logindatas.length === 0) {
					new Logindata({
						Companyname : req.body.companyname,
						Email : req.body.email,
						Username : req.body.username,
						Password : req.body.password,
						CreateDate : Date.now()
					}).save(function(err) { //將帳密儲存到資料庫裡
						if (err) {
							console.log('Logindata Fail to save to DB.');
							return;
						}
						console.log('Logindata Save to DB.');
						req.session.companyname = req.body.companyname;
						req.session.username = req.body.username;
						req.session.password = req.body.password;
						req.session.logined = true;
						res.redirect('../users/registersuccess');
					        
					        Logindata.find({
					        	Companyname : req.body.companyname
					        }, function(err, logindata, count) {
					        		console.log(logindata[0]._id);
					        		var hashid = md5(logindata[0]._id.toString('binary'));				        		
					        		console.log(hashid);					        	
//						    		console.log(md5(logindata[0]._id)); 錯的 需要轉編碼才行
						    		mailTransport.sendMail({
							        from: '"BIAU": biaufileserver@gmail.com',
							        to: req.body.email,
							        subject: 'BIAU感謝您的註冊',
							        html: '<h2>BIAU感謝您的註冊</h2> <p>您之後的上傳密碼為'+hashid+'請牢記</p>'
							    }, function(err) {
							        if(err){
							            console.error('Unable to send confirmation: ' + err.stack);
							        		}
							    });
					        });
					});
					
				}
				else{
					req.session.logined = false;
					res.render('users/register', {
						message : "email: " + req.body.username + " 被註冊過了喔 "
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

module.exports = router;