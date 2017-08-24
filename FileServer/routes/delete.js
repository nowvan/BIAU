/* 使用者刪除檔案功能. */
require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var File = mongoose.model('File');
var DFile = mongoose.model('DFile');
var fs = require('fs');


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
/*        原本要真的刪掉時的程式碼 現在轉為其他資料夾 所以不用
		fs.unlink(__dirname.slice(0, -7) + '/public/uploads/'+files[0].Companyname+'/'+ files[0].Filename, function(err) {
			if (err) {
				throw err;
			} else {
				console.log('目录删除成功');
			}
		});
*/
		//把資料寫入暫時刪除的資料庫裡
		new DFile({
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
				//把檔案移動到 delete資料夾裡
				fs.rename(__dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/'+ files[0].Filename, __dirname.slice(0, -7)+'/public/uploads/'+files[0].Companyname+'/delete/'+ files[0].Filename, function(err) {
					if ( err ) {console.log('ERROR: ' + err);}
					//移掉資料庫裡的資料	
					File.remove({
						_id : req.params.id
					}, function(err) {
						if (err) {
							console.log('Fail to delete article.');
						} else {
							console.log('Done');
							res.redirect('/users/manage');
						}
					});// File.remove
				});	//把檔案移動到 delete資料夾裡
			}
		});// DFile save
	});// File.find
});

module.exports = router;