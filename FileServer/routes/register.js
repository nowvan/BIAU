/* 使用者註冊會員功能. */
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

module.exports = router;