var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
 
//登入資料
var Logindata = new Schema({
	Companyname: String,
	Email: String,
	Username: String,
	Password: String,	
	CreateDate: Date
});
//檔案資料
var File = new Schema({
	Companyname: String,
	Originalname: String,
    Filename: String,
	CreateDate: Date
});
//刪除檔案的資料
var DFile = new Schema({
	Companyname: String,
	Originalname: String,
    Filename: String,
	CreateDate: Date
});


mongoose.model( 'File', File );
mongoose.model( 'DFile', DFile );
mongoose.model( 'Logindata', Logindata );
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://nowvan:nccutest@ds123312.mlab.com:23312/uploadfile');