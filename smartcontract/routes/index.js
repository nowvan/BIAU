/*jshint esversion: 6 */

var express = require('express');
var router = express.Router();
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');


/* GET home page. */
router.get('/', function(req, res, next) {
	
	var contractAddress;
	
	
	/*
	* connect to ethereum node
	*/ 
	const ethereumUri = 'http://localhost:8545';
	const address = '0xb45478695DA7DD8774a3511c65E2A2CF82AD91e7'; // user

	var web3 = new Web3();
	var eth = web3.eth;
	web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

	if(!web3.isConnected()){
	    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
	}else{
	    console.log('connected to ehterum node at ' + ethereumUri);
	    let coinbase = web3.eth.coinbase;
	    console.log('coinbase:' + coinbase);
	    let balance = web3.eth.getBalance(coinbase);
	    console.log('balance:' + web3.fromWei(balance, 'ether') + " ETH");
	    let accounts = web3.eth.accounts;
	    console.log(accounts);
	    
//	    if (web3.personal.unlockAccount(address, '')) {
//	        console.log(`${address} is unlocaked`);
//	    }else{
//	        console.log(`unlock failed, ${address}`);
//	    }
	}

	//////////////////////////////////////////////////////////////////////

	/*
	* Compile Contract and Fetch ABI, bytecode
	*/ 
	let source = fs.readFileSync("../contracts/sentfile.sol", 'utf8');
	console.log('compiling contract...');
	let compiledContract = solc.compile(source);
	console.log('done');
	for (let contractName in compiledContract.contracts) {
	    // code and ABI that are needed by web3 
	     console.log(contractName + ': ' + compiledContract.contracts[contractName].bytecode);
	     console.log(contractName + '; ' + JSON.parse(compiledContract.contracts[contractName].interface));
	    var bytecode = compiledContract.contracts[contractName].bytecode;
	    var abi = JSON.parse(compiledContract.contracts[contractName].interface);
	}
	JSONabi= JSON.stringify(abi, undefined, 2);
	console.log(JSON.stringify(abi, undefined, 2));


	/////////////////////////////////////////////////////////////////////
	let gasEstimate = web3.eth.estimateGas({data: '0x' + bytecode });
	console.log('gasEstimate = ' + gasEstimate);

	let MyContract = web3.eth.contract(abi);
	console.log('deploying contract...');

	let myContractReturned = MyContract.new([], {
	    from: address,
	    data: '0x'+ bytecode,
	    gas: gasEstimate 
	}, function (err, myContract) {
	    if (!err) {
	        // NOTE: The callback will fire twice!
	        // Once the contract has the transactionHash property set and once its deployed on an address.
	      
	        // e.g. check tx hash on the first call (transaction send)
	        if (!myContract.address) {
	            console.log(`myContract.transactionHash = ${myContract.transactionHash}`); // The hash of the transaction, which deploys the contract
	          
	        // check address on the second call (contract deployed)
	        } else {
	            console.log(`myContract.address = ${myContract.address}`); // the contract address
	            contractAddress = myContract.address;
	        }
	        
	        
	        // Note that the returned "myContractReturned" === "myContract",
	        // so the returned "myContractReturned" object will also get the address set.
	    } else {
	        console.log(err);
	    }       
        
	});
			
	var start = Date.now();	
	setTimeout(function () {
	    console.log(Date.now() - start + 'GG!\r\n');
	    res.render('index', {contractAddress: contractAddress });
	    
	    console.log(contractAddress);
		
		// simpleStorage 的 ABI
		var producecontract = web3.eth.contract(
				abi).at(contractAddress)
	    
		 //以 eth.contract 參照 ABI 製造出合約正本
	    contractControl(producecontract, eth);
	    
	}, 2000);
	
});

function contractControl(producecontract, eth) {
	
//	var txHash = producecontract.putFileInfo("黑松","file-1.1.1.rar","0xca35b7d915458ef540ade6068dfe2f44e8fa733c1111","這次很棒喔",
//	        {
//				from: eth.accounts[0],
//				gas: 3141592
//			})
//	      
//	        console.log('txHash is : ' + txHash);
//	    	console.log('檔案以上傳  ');
	
	// 當 simplgestorage 的 setEvent 被發射的時候，就會被如此接住
    producecontract.fileUploadEvent({}, function(err, eventdata) {
		console.log('dataSet fired : ');
		console.log(eventdata);
		console.log("收到");
	})     
	    
    
}


module.exports = router;
