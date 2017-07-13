// 用來 log 於 底部

function log(input) {
	if (typeof input === 'object')
		$('#log').text($('#log').text() + JSON.stringify(input, null, 2) + '\n')
	else
		$('#log').text($('#log').text() + input + '\n')
}

// 當頁面載入完成時
$(function() {
	// 連結 enode
	var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
	var eth = web3.eth
	
	log(  document.getElementById('contractAddress').value  );
	
	// simpleStorage 的 ABI
	var producecontract = web3.eth.contract(
			[
				  {
				    "constant": false,
				    "inputs": [],
				    "name": "isCompany",
				    "outputs": [
				      {
				        "name": "",
				        "type": "bool"
				      }
				    ],
				    "payable": false,
				    "type": "function"
				  },
				  {
				    "constant": false,
				    "inputs": [
				      {
				        "name": "filename",
				        "type": "string"
				      },
				      {
				        "name": "url",
				        "type": "string"
				      }
				    ],
				    "name": "putFile",
				    "outputs": [],
				    "payable": false,
				    "type": "function"
				  },
				  {
				    "constant": true,
				    "inputs": [],
				    "name": "company",
				    "outputs": [
				      {
				        "name": "",
				        "type": "address"
				      }
				    ],
				    "payable": false,
				    "type": "function"
				  },
				  {
				    "inputs": [],
				    "payable": false,
				    "type": "constructor"
				  },
				  {
				    "anonymous": false,
				    "inputs": [
				      {
				        "indexed": false,
				        "name": "from",
				        "type": "address"
				      },
				      {
				        "indexed": false,
				        "name": "Filename",
				        "type": "string"
				      },
				      {
				        "indexed": false,
				        "name": "Url",
				        "type": "string"
				      }
				    ],
				    "name": "dataSet",
				    "type": "event"
				  }
				]).at(document.getElementById('contractAddress').value)

    
	 //以 eth.contract 參照 ABI 製造出合約正本
	

    contractControl(producecontract, eth)
})

// 這裡將控制 simplestorage 與 網頁介面的接合，無論是事件處理還是輸入互動
function contractControl(producecontract, eth) {
	// 當 simplgestorage 的 setEvent 被發射的時候，就會被如此接住
	
    producecontract.dataSet({}, function(err, eventdata) {
		log('dataSet fired : ')
		log(eventdata.args)
	})
   
    
    
    $('#putfile').on('click', function() {
       
		// 得到 input 的值後，並送出 putFile 的 Transaction (因為這是一個改變資料庫的行為)
		// 記得補上 TxObject (from 的這塊物件)
		// 然後得到 此 Transaction 的 hash
		var txHash = producecontract.putFile($('#filename').val(),$('#url').val(), 
        {
   //.................................................................
			from: eth.accounts[0]
		})
        log('txHash is : ' + txHash)
        log('檔案以上傳  ')
	})
	    
    
}