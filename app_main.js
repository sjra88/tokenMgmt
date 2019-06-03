const express = require('express');
const app = express();
var url = require("url");

// const web3 = TM.connect_HTTP_Provider(TokenConfig.PROVIDER_URL, TokenConfig.CHAIN_ID);
// const SECRET_TOKEN = TM.CTokenF_Init(web3, TokenConfig.CToken_Address, "Token.abi.json");
// TM.showERC20TokenInfo(web3, SECRET_TOKEN);

app.use(express.json());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/token", require("./route/token-mgmt").router);
app.use("/db", require("./route/db-mgmt").router);

app.use("/admin", express.static(__dirname + '/public'));
//app.use("/user", express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.send("welcome!!!");
});

app.get("/admin", function(req, res){
    console.log("get:token_admin.html");
    //최초 루트 get 요청에 대해, 서버에 존재하는 html 파일 전송
    res.sendFile("token_admin.html", {root: __dirname+'/public'});
});

// app.get("/user", function(req, res){
//     console.log("get:user_admin.html");
//     res.sendFile("user_admin.html", {root: __dirname+'/public'});
// });


//기타 웹 리소스 요청에 응답
app.use(function(req, res){
    var fileName = url.parse(req.url).pathname.replace("/","");
    res.sendFile(fileName, {root: __dirname});
    if (req.url !="/favicon.ico")              //favicon is 아이콘
        console.log("use1:", fileName); 
});
   
/* 
app.use(function(req, res, next){
    res.status(404).send('sorry cant find that');
    //
})
*/
//http 서버 생성
console.log("==========================================================================================")
var server = require('http').createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listening on port ${port}`));
