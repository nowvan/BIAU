// 所有頁面的顯示都在這一頁
require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var File = mongoose.model('File');
var DFile = mongoose.model('DFile');

// 使用者註冊頁面
router.get('/register', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render( 'users/register', {
        message: ""
    });
});

// 使用者登入頁面
router.get('/signin', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render( 'users/signin', {
        message: ""
    });
});

// 使用者登出頁面.
router.get('/signout', function(req, res, next) {
    req.session.logined = false;
    res.redirect('/');
    res.end();
});

// 忘記密碼頁面 還沒時做出來
router.get('/forget', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render('users/forget');
});

// 使用者管理頁面
router.get('/manage', function(req, res, next) {
    if ((!req.session.companyname) || (!req.session.logined)) {
        res.redirect('/');
        return;
    }
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;
    File.find({ Companyname: req.session.companyname },  function ( err, files, count ){
		var fileUrl = [];
    	for (var i = 0; i < files.length; i++) {
    		fileUrl[i] = "<a href= /file/" + files[i].Filename + "?companyname="+ files[i].Companyname +">" + files[i].Originalname + "</a>";
		  	}
    	
    	DFile.find({ Companyname: req.session.companyname },  function ( err, dfiles, count ){
        	var i = 0;
    		var dfileUrl = [];
        	for (i = 0; i < dfiles.length; i++) {
        		dfileUrl[i] = "<a href= /file/" + dfiles[i].Filename + "?companyname="+ dfiles[i].Companyname +">" + dfiles[i].Originalname + "</a>";
    		  	}   
        	
        	res.render( 'users/manage', {
                title : 'File System',
                files: files,
                fileurl: fileUrl,
                dfiles: dfiles,
                dfileurl: dfileUrl
            });     	
        });    		
    });
});
//展示當時頁面
router.get('/showfiles', function(req, res, next) {
    if ((!req.session.companyname) || (!req.session.logined)) {
        res.redirect('/');
        return;
    }
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;
    File.find({ Companyname: req.query.companyname },  function ( err, files, count ){
		var fileUrl = [];
    	for (var i = 0; i < files.length; i++) {
    		fileUrl[i] = "<a href= /file/" + files[i].Filename + "?companyname="+ files[i].Companyname +">" + files[i].Originalname + "</a>";
		  	}
        res.render( 'users/showfiles', {
            title : 'File System',
            files: files,
            fileurl: fileUrl
        });
    });
});


// 新增檔案頁面
router.get('/add_file', function(req, res, next) {
    if ((!req.session.companyname) || (!req.session.logined)) {
        res.redirect('/');
        return;
    }
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;
    res.render('users/add_file');
});

//檔案成功上傳頁面
router.get('/uploadssuccess', function(req, res, next) {
    if ((!req.session.companyname) || (!req.session.logined)) {
        res.redirect('/');
        return;
    }
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;
    res.render('users/uploadssuccess');
});

module.exports = router;