var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var File = mongoose.model('File');

/* GET listfile page. */
router.get('/',function(req, res, next) {  

	function traverseDirectory(dirname, callback) {
		var directory = [];
		fs.readdir(dirname, function(err, list) {
			dirname = fs.realpathSync(dirname);
			//console.log(dirname);///////////////////
			if (err) {
				return callback(err);
			}
			var listlength = list.length;
			console.log(list);//////////////////////////
			list.forEach(function(file) {
				// file = dirname + '\\' + file;
				file = 'file/'+file;
				fs.stat(file, function(err, stat) {
					directory.push(file);
					console.log(file);/////////////////////
					console.log(directory);/////////////////////
						if (!--listlength) {
							callback(null, directory);
						}
				});
			});
		});
	}
	traverseDirectory(__dirname+ '/../public/data', function(err, result) {
		if (err) {
			console.log(err);
		}
		console.log(result);	
		//  console.log(result.length);
		// console.log(result[0]);
		// console.log(result[1]);
		  var i;
		  var text = "";
		  for (i = 0; i < result.length; i++) {
			  text += "<h3><a href= " + result[i] + ">" + result[i] + "</a></h3>";
		  	}
		  console.log(text);
		 	  
		res.render('listfile', {
			title: result ,
			text: text
		});

	});


});

/* GET file */
router.get('/:name', function (req, res, next) {
	 
		
	//console.log(__dirname.slice(0,-7));	
	  var options = {
	    root: __dirname.slice(0,-7) + '/public/uploads/'+req.query.companyname + '/',
	    dotfiles: 'deny',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true
	    }
	  };
	  
	  var fileName = req.params.name;	  
//	  console.log(fileName,options.root);
	  res.sendFile(fileName, options, function (err) {
	    if (err) {
	      next(err);
	    } else {
	      console.log('Sent:', fileName);
	    }
	  });	  
	  
}); 


module.exports = router;
