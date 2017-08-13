/*jshint esversion: 6 */

var express = require('express');
const fs = require('fs');
var router = express.Router();
const IPFS = require('ipfs');
const os = require('os');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */

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
	
	// Create an IPFS node
	const node = new IPFS({
	  init: true,
	  start: true,
	  repo: repoPath //'ipfs-0.33204127476160483'
	});
	
	function handleInit (err) {
	  if (err) {
	    throw err;
	  }
	
	  node.start(() => {
	    console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
	
	    //document.getElementById("status").innerHTML= 'Node status: ' + (node.isOnline() ? 'online' : 'offline');
	
	    
	    
	    
	    setTimeout(function(){
	    	console.log('1');
	    	const addr = '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmQ7XiNVS91PyvGLXrxJiwacFkb22XP4x5UxgNA1KUQYZ7';
		    node.swarm.connect(addr, function (err) {
		    	  if (err) {
		    	    throw err;
		    	  }
		    	  console.log(addr);
		    	  // if no err is present, connection is now open
		    	});	    
	    
	    },1000);
	    /*
	    setTimeout(function(){
	    	console.log('3');
	    	node.swarm.peers(function (err, peerInfos) {
		    	  if (err) {
		    	    throw err;
		    	  }
		    	  console.log(peerInfos);
		    	});	    
	    
	    },3000);
	    */
	    

	    
	    
	    //const hash = 'QmZSm2NANrdEREwhesUwU9htLdg9PZXr7tSSguBHz1ZdXR';
	    //const hash = 'QmYxoauR4YhTpjwgZGhcG8Zg3EjPJiiY4f2nDLqKz5PbhY';
	    
        setTimeout(function(){
	    	console.log('3');
	    	const hash = 'QmTuneUZdjb9RA2oLHG333NtjAi9WoEPxssnarTWBFwFf8';
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
	            fs.writeFile("../public/downloadtest0806.txt", output, function(err) {
	                if(err) {
	                    return console.log(err);
	                }
	                console.log("The file was saved!");
	            }); 
	            
	          }));
	        });
	    
	    },3000);
        
        
        
	  });  
	}
	
	//Init the node
	node.init(handleInit);
	res.render('index', { title: 'IPFSDOWNLOAD' });
});

module.exports = router;
