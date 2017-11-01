var express = require('express');
var router = express.Router();
var fs = require('fs');

// 得到檔案
router.get('/:name', function(req, res, next) {

	var options = {
		root : __dirname.slice(0, -7) + '/public/data/',
		dotfiles : 'deny',
		headers : {
			'x-timestamp' : Date.now(),
			'x-sent' : true
		}
	};

	var fileName = req.params.name;
	// console.log(fileName,options.root);
	res.sendFile(fileName, options, function(err) {
		if (err) {
			next(err);
		} else {
			console.log('Sent:', fileName);
		}
	});
});

// 最原先老師要我做的東西，自己列出在資料夾裡的檔案 GET listfile page.
router.get('/', function(req, res, next) {

	function traverseDirectory(dirname, callback) {
		var directory = [];
		fs.readdir(dirname, function(err, list) {
			dirname = fs.realpathSync(dirname);

			if (err) {
				return callback(err);
			}
			var listlength = list.length;
			list.forEach(function(file) {

				fs.stat(file, function(err, stat) {
					directory.push(file);
					// console.log(file);
					// console.log(directory);
					if (!--listlength) {
						callback(null, directory);
					}
				});
			});
		});
	}
	traverseDirectory(__dirname + '/../public/data',function(err, result) {
				if (err) {
					console.log(err);
				}
				console.log(result);

				var i;
				var text = "";
				for (i = 0; i < result.length; i++) {
					text += "<h3><a href= " + result[i] + ">" + result[i]
							+ "</a></h3>";
				}
				// console.log(text);
				res.render('listfile', {
					result : result,
					text : text
				});
			});
});

module.exports = router;
