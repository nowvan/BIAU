/* 使用者登入會員功能. */
require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Logindata = mongoose.model('Logindata');

router.post('/login', function(req, res, next) {
	
	//找資料庫裡的資料比對
	Logindata.find({
		Email : req.body.email
	}, function(err, logindata, count) {
		console.log(logindata);
		//沒找到帳號
		if (logindata.length === 0) {
			req.session.logined = false;
			res.render('users/signin', {
				message : "此信箱沒有註冊過 "
			});
		} else {
			if (logindata[0].Password === req.body.password) {
				req.session.companyname = logindata[0].Companyname;
				req.session.username = logindata[0].Username;
				//req.session.password = logindata[0].Password;
				req.session.logined = true;
				res.redirect('/');	
			} else { //沒找到密碼
				req.session.logined = false;
				res.render('users/signin', {
					message : "密碼錯誤 請重新輸入  "
				});
			}
		}
	});
});


module.exports = router;