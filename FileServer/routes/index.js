require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Logindata = mongoose.model('Logindata');
var File = mongoose.model('File');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;

    Logindata.find( function ( err, datas, count ){
    	var i = 0;
		var companynames = [];
    	for (i = 0; i < datas.length; i++) {
    		companynames[i] = "<a href= /users/showfiles?companyname=" + datas[i].Companyname + ">" + datas[i].Companyname + "</a>";
		  	console.log(datas[i].Username);
    	}
    	
        res.render( 'index', {
            title : 'Company',
            companynames: companynames,
        });
    });
});

module.exports = router;
