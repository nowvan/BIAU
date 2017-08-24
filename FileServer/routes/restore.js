require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var File = mongoose.model('File');
var DFile = mongoose.model('DFile');

router.get('/restore/:id', function(req, res, next) {
	
	// 找出DFile資料
	DFile.find({
		_id : req.params.id
	}, function(err, files, count) {
		
		new File({
			Companyname : files[0].Companyname,
			Originalname : files[0].Originalname,
			Filename : files[0].Filename,
			CreateDate : files[0].CreateDate
		}).save(function(err) {
			if (err) {
				console.log('Fail to save to DB.');
				return;
			}else{
				console.log('Save to DB.');
				//移動資料夾
				fs.rename( __dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/delete/'+ files[0].Filename , __dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/'+ files[0].Filename, function(err) {
					if ( err ) {console.log('ERROR: ' + err);}
					DFile.remove({
						_id : req.params.id
					}, function(err) {
						if (err) {
							console.log('Fail to delete article.');
						} else {
							console.log('Done');
							res.redirect('/users/manage');    
						}
					});// DFile.remove
				});// 移動資料夾
			}
		});// File save
	});// DFile.find
});

module.exports = router;