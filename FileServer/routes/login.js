/* 使用者登入會員功能. */
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