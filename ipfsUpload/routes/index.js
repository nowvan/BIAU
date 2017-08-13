/*jshint esversion: 6 */
/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */
var express = require('express');
const fs = require('fs');
var router = express.Router();
const IPFS = require('ipfs');
const os = require('os');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
const dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
const bs58 = require('bs58');
const Readable = require('readable-stream');
const loadFixture = require('aegir/fixtures');
const bl = require('bl');
const isNode = require('detect-node');
const concat = require('concat-stream');
const through = require('through2');
const Buffer = require('safe-buffer').Buffer;

/* GET home page. */
router.get('/', function(req, res, next) {


	console.log('start');
	const repoPath = 'ipfs-' + Math.random();
	console.log(repoPath);
	// Create an IPFS node
	const node = new IPFS({
	  init: true,
	  start: true,
	  repo: repoPath
	 
	});
	//
	const fileToAdd = {
	  path: 'version3.txt' ,
	  content: fs.createReadStream('../public/version3.txt')
	};
	
	function handleInit (err) {
	  if (err) {
	    throw err;
	  }
	
	  node.start(() => {
	    console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
	
	    //document.getElementById("status").innerHTML= 'Node status: ' + (node.isOnline() ? 'online' : 'offline');
		    
	    //console.log(node.id);
	    node.files.add(fileToAdd, function (err, res) {
	      if (err || !res) {
	        return console.error('Error - ipfs files add', err, res);
	      }
	
	      res.forEach(function (file) {
	        console.log('successfully stored', file);
	        
	
	        const hash1 = file.hash;
	        node.files.cat(hash1, function (err, stream) {
	          var res = '';
	
	          stream.on('data', function (chunk) {
	            res += chunk.toString();
	          });
	
	          stream.on('error', function (err) {
	            console.error('Error - ipfs files cat ', err);
	          });
	
	          stream.on('end', function () {
	            //console.log('Got:', res);
	            //res.render('index', { got: res });
	            
	          });
	        });
	        
	        		const hash = hash1;
	            node.files.get(hash, (err, stream) => {
	              expect(err).to.not.exist();

	              let files = [];
	              stream.pipe(through.obj((file, enc, next) => {
	                file.content.pipe(concat((content) => {
	                  files.push({
	                    path: file.path,
	                    content: content
	                  });
	                  next();
	                }));
	              }, () => {
	                expect(files).to.be.length(1);
	                expect(files[0].path).to.be.eql(hash);
	                var output = files[0].content;
	                //console.log(output);
	                fs.writeFile("../public/download0810.txt", output, function(err) {
	                    if(err) {
	                        return console.log(err);
	                    }
	                    console.log("The file was saved!");
	                }); 
	                
	              }));
	            });
	        
	        
	      });
	
	
	    });
	    
	  });
	}
	
	//Init the node
	node.init(handleInit);
	res.render('index', { title: 'IPFSUPLOAD&DOWNLOAD' });
});

module.exports = router;
