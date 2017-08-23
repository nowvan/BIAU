require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var File = mongoose.model('File');
var DFile = mongoose.model('DFile');

/* 使用者註冊頁面. */
router.get('/register', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render( 'users/register', {
        message: ""
    });
});

/* 使用者登入頁面. */
router.get('/signin', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render( 'users/signin', {
        message: ""
    });
});

/* 使用者登出頁面. */
router.get('/signout', function(req, res, next) {
    req.session.logined = false;
    res.redirect('/');
    res.end();
});

/* 忘記密碼頁面. */
router.get('/forget', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render('users/forget');
});

/* 使用者管理頁面. */
router.get('/manage', function(req, res, next) {
    if ((!req.session.companyname) || (!req.session.logined)) {
        res.redirect('/');
        return;
    }
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;
    File.find({ Companyname: req.session.companyname },  function ( err, files, count ){
    	var i = 0;
		var fileurl = [];
    	for (i = 0; i < files.length; i++) {
    		fileurl[i] = "<a href= /file/" + files[i].Filename + "?companyname="+ files[i].Companyname +">" + files[i].Originalname + "</a>";
		  	}
    	
    	DFile.find({ Companyname: req.session.companyname },  function ( err, dfiles, count ){
        	var i = 0;
    		var dfileurl = [];
        	for (i = 0; i < dfiles.length; i++) {
        		dfileurl[i] = "<a href= /file/" + dfiles[i].Filename + "?companyname="+ dfiles[i].Companyname +">" + dfiles[i].Originalname + "</a>";
    		  	}   
        	
        	res.render( 'users/manage', {
                title : 'File System',
                files: files,
                fileurl: fileurl,
                dfiles: dfiles,
                dfileurl: dfileurl
            });
        	
        	
           });
    	
    	
    });
});
//展示當按頁面
router.get('/showfiles', function(req, res, next) {
    if ((!req.session.companyname) || (!req.session.logined)) {
        res.redirect('/');
        return;
    }
    res.locals.companyname = req.session.companyname ;
    res.locals.username = req.session.username ;
    res.locals.authenticated = req.session.logined;
    File.find({ Companyname: req.query.companyname },  function ( err, files, count ){
    	var i = 0;
		var fileurl = [];
    	for (i = 0; i < files.length; i++) {
    		fileurl[i] = "<a href= /file/" + files[i].Filename + "?companyname="+ files[i].Companyname +">" + files[i].Originalname + "</a>";
		  	}
        res.render( 'users/showfiles', {
            title : 'File System',
            files: files,
            fileurl: fileurl
        });
    });
});


/* 新增檔案頁面. */
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

/* 修改檔案頁面. */
router.get('/reply/:id', function(req, res, next) {
    if ((!req.session.companyname) || (!req.session.logined)) {
        res.redirect('/');
        return;
    }
    res.locals.username = req.session.companyname ;
    res.locals.authenticated = req.session.logined;
    res.locals.messageID = req.params.id;
    		
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