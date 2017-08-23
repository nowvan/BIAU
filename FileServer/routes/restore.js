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
				res.redirect('/users/manage');    
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

//	setTimeout(function () {
//		res.redirect('/users/manage');    
//	}, 1000);
});

module.exports = router;