/* 使用者註冊會員功能. */
require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Logindata = mongoose.model('Logindata');


router.post('/register', function(req, res, next) {

	Logindata.find({
		Companyname : req.body.companyname
	}, function(err, logindatas, count) {
		console.log(logindatas);
		//檢查公司名稱有沒有被註冊過  怕其他人隨意註冊公司可以去修改別人的資料
		if (logindatas.length === 0) {
		
			Logindata.find({
				Username : req.body.username
			}, function(err, logindatas, count) {
				//檢查使用者名稱有沒有被註冊過
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

module.exports = router;