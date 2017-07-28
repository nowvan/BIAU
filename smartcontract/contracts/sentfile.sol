
pragma solidity ^0.4.0;
contract SentFile {
    
    struct File {
        string company;
        string filename;
        string url;
        string newest;
    }
    
    address public BIAU;

    mapping(string => File) Files;
    
    //發送檔案已經更新的事件
    event fileUploadEvent(string company, string filename, string url, string newest);
    
    //BIAU是op合約的專案
    function SentFile() {
        BIAU = msg.sender;
    }
    
    //上傳檔案的必須是這專案後台
    function isBIAU() returns (bool) {
        return (msg.sender == BIAU);
    }
    
   //公司放檔案上去
    function putFileInfo(string company, string filename, string url ,string newest
    ) {
        if (!isBIAU()) {
            throw;
        }
        
        Files[company] = File({
            company: company,    
            filename: filename,
            url: url,
            newest: newest
        });
        
        //         發射事件
        fileUploadEvent(company, filename, url, newest);
        
    }
    
     function getFileInfo(string company) constant returns (string filename, string url ,string newest
     ) {
      
        var fileInfo = Files[company];
        
        filename = fileInfo.filename;
        url = fileInfo.url;
        newest = fileInfo.newest;
     }
}
    