require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Logindata = mongoose.model('Logindata');
var fs = require('fs');

// 首頁
router.get('/', function(req, res, next) {
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;    	
        res.render( 'index', {
        });
});
//列出所有公司 已無用
//router.get('/all', function(req, res, next) {
//    res.locals.companyname = req.session.companyname ;
//    res.locals.username = req.session.username ;
//    res.locals.authenticated = req.session.logined;
//
//    Logindata.find( function ( err, datas, count ){
//		var companynames = [];
//		// 列出所有公司
//    	for (var i = 0; i < datas.length; i++) {
//    		companynames[i] = "<a href= /users/showfiles?companyname=" + datas[i].Companyname + ">" + datas[i].Companyname + "</a>";
//		  	console.log(datas[i].Username);
//    	}
//    	
//        res.render( 'all', {
//            title : 'Company',
//            companynames: companynames
//        });
//    });
//});




module.exports = router;
