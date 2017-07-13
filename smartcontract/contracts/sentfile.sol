pragma solidity ^0.4.0;
contract SentFile {

    struct File {
        string Filename;
        string Url;
    }
    
    address public company;
    mapping(address => File) Files;
    
    event dataSet(address from, string Filename, string Url);

    function SentFile() {
        company = msg.sender;
    }

    function isCompany() returns (bool) {
        return (msg.sender == company);
    }
    
   
    function putFile( string filename,string url 
    ) {
        if (!isCompany()) {
            throw;
        }
        
            Files[company] = File({
            Filename :filename,
            Url :url
        });
        
        //         µo®g¨Æ¥ó
        dataSet(msg.sender, filename, url);
        
    }
    
    
    
}