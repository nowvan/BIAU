# BIAU
區塊鏈+IPFS家用閘道器自動更新
用私有鏈來部署智能合約

安裝步驟
1.
從https://github.com/nowvan/BIAU 下載至電腦
2.
安裝套件
進入Fileserver 的終端機介面 輸入npm install
進入GW-ipfs 的終端機介面 輸入npm install
進入GW2-ipfs 的終端機介面 輸入npm install
3.
創建資料庫 
可以去 mlab.com申請免費500m 空間的mongodb
4.
修改Fileserver/lib/db 更換成自己的資料庫
5.
部署自己的私有鍊（下面有教學）
6.
部署智能合約
修改smartcontract/index.js裡的 const address  修改成自己的帳號
進入smartcontract 的終端機介面 輸入npm install 
進入smartcontract 的終端機介面 輸入npm start
在網頁開啟localhost:3030
7.
伺服器連上智能合約
將顯示出來的合約位置（必須在有開著節點的時候 合約位置也會出現在console裡）
拿來修改Fileserver/routes/uploadfile.js 裡的 const contractAddr 
以及GW-ipfs/app.js 裡的 const contractAddr 
以及GW2-ipfs/app.js 裡的 const contractAddr 
8.
使用
進入Fileserver 的終端機介面 輸入npm start
在網頁開啟localhost:3000
註冊自己的公司 （之後將GW-ipfs或GW2-ipfs改成申請公司的模擬閘道器）
9.
公司模擬閘道器
將GW-ipfs/app.js 裡的  
const company 改成公司名稱;
const id 改成 mongodb裡logindatas裡自己註冊公司資料裡
"_id": {
        "$oid": "598ad2a3f9e7a0312c7ca6bf"的這一段
    }
進入GW-ipfs 的終端機介面 輸入npm start
10.
在網頁開啟localhost:3002/file
之後上傳的檔案就能在這裏顯示出來 實際的檔案位置在GW-ipfs/public/data裡面
11.
上傳檔案 （二次密碼會在申請的email裡）




