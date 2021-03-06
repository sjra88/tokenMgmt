const express = require('express');
//const TM = require("./token-module.js");
const TokenConfig = require("../config/TokenConfig");

// DB Connection start....
const mysql = require('mysql');
const dbconfig = require("../config/database");
var connection = mysql.createConnection(dbconfig);

connection.connect(function(err){
    console.log("==========================================================================================")
    console.log("Host       :", dbconfig.host);
    console.log("User       :", dbconfig.user);
    console.log("Password   :", "*******");
    console.log("Port       :", dbconfig.port);
    console.log("Database   :", dbconfig.database);

    if(!err) {
        console.log("Database is connected ... ");    
    } else {
        console.log("Not Connected database ... ");
        console.log("ERROR      :",err);
        // console.log("Host       :", TokenConfig.host);
        // console.log("User       :", TokenConfig.user);
        // console.log("Password   : ******");
        // console.log("Port       :", TokenConfig.port);
        // console.log("Database   :", TokenConfig.database);
        // console.log("ERROR      :",err);
    }
    console.log("==========================================================================================")
});

// mQuery = "select Holdername, Address, Privatekey, SECRET_init from secret_wallet.tokenholder where network = 600600 limit 2";
// connection.query(mQuery, function(err, rows, field){
//     try {
//         console.log("rows: ", rows);
// var results = [];
// for (var i=0; i<rows.length; i++) {
//     results.push(rows[i].resultId);
// }
//         //console.log("field: ", field);

//     } catch(err) {
//         console.log("err: ", err);
//     }
// });

// connection.end();
// DB Connection End....


// router start....
var router = express.Router();

router.get('/', function (req, res){
    // console.log('\x1b[30m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: red`); //Text: red
    // console.log('\x1b[31m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: green`); //Text: green
    // console.log('\x1b[32m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: yellow`); //Text: yellow
    // console.log('\x1b[33m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: Blue`); //Text: Blue
    // console.log('\x1b[34m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: pupple`); //Text: pupple
    // console.log('\x1b[35m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: Cyan`); 
    // console.log('\x1b[36m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: White`); //
    // console.log('\x1b[37m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: White`); //
    // console.log('\x1b[38m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd},//Text: White`); //
    // console.log('\x1b[39m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: White`); //
    // console.log('\x1b[40m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Text: White`); //Back: red
    // console.log('\x1b[41m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Back: red`); //Back: green
    // console.log('\x1b[42m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Back: green`); //Back: yellow
    // console.log('\x1b[43m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Back: yellow`); //Back: Blue
    // console.log('\x1b[44m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Back: Blue`); //Back: Pupple
    // console.log('\x1b[45m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Back: Pupple`); //Back: cyan
    // console.log('\x1b[46m%s\x1b[0m', ` ${Date()}, Method: GET[4], CMD: ${req.params.cmd}, //Back: cyan`);

    console.log("[GET] params1: ", req.params);

});
var ret;
var msg;
var responseData;

router.get('/tokenholder', function (req, res){
    console.log('\x1b[43m%s\x1b[0m', ` Method: GET[1], CMD: tokenholder, [DATE] ${Date()}`);

    var mQuery = `select Holdername, Address, Privatekey, SECRET_init from secret_wallet.tokenholder where network = ${TokenConfig.CHAIN_ID} ORDER BY disp_order,Holdername ASC` ;
    connection.query(mQuery, function(err, rows, field){
        try {
            if (typeof rows !== 'undefined'){
                console.log("!!!!!!DB GET rows: ", rows);
                sCode = 200;
                ret = JSON.stringify(rows);
                msg = "[OK] get token holder";
            // var results = [];
            // for (var i=0; i<rows.length; i++) {
            //     results.push(rows[i].resultId);
                //console.log("field: ", field);
                responseData = [{"Success": (sCode==200? true : false),"Name" : "TOKEN-HOLDER", "ID" : 101 }, {"value": ret, "msg": msg}];
                console.log("RESPONSE: ", responseData);
                res.status(sCode);
                res.json(responseData);        
    
            }else {
                console.log("!!!!!!ERROR: ", rows);
                sCode = 400;
                ret = JSON.stringify(rows);
                msg = "[ERRPR] Query Syntax is wrong, check again!!!";
            // var results = [];
            // for (var i=0; i<rows.length; i++) {
            //     results.push(rows[i].resultId);
                //console.log("field: ", field);
                responseData = [{"Success": (sCode==200? true : false),"Name" : "TOKEN-HOLDER", "ID" : 101 }, {"value": ret, "msg": msg}];
                console.log("RESPONSE: ", responseData);
                res.status(sCode);
                res.json(responseData);            
            }
        } catch(err) {
            sCode = 400;
            ret = -1;
            msg = err;
            responseData = [{"Success": (sCode==200? true : false),"Name" : "TOKEN-HOLDER", "ID" : 101 }, {"value": ret, "msg": msg}];
            console.log("RESPONSE: ", responseData);
            res.status(sCode);
            res.json(responseData);        
        }
    });
});

router.get('/tokenholder/:addr', function (req, res){
    console.log("Params: ", req.params);
    var vAddr = req.params.addr;
});

router.get('/secret', function (req, res){
    console.log('\x1b[42m%s\x1b[0m', ` Method: GET[2], CMD: TokenInfo, [DATE] ${Date()}`);
    sCode=200;
    MyToken = TM.CTokenF_GetInfo();
    console.log(MyToken);
//       responseData = [{"Success": (sCode==200? true : false),"Name" : "ETHER-BALANCE", "ID" : 10 }, {"value": ret, "msg": msg}];
    res.status(sCode);
    res.json(MyToken);
})

router.get('/secret/:cmd', function (req, res){
        //console.log(req.body.TYPE);    
    var vTYPE = req.params.cmd;
    console.log('\x1b[42m%s\x1b[0m', ` Method: GET[3], CMD: ${req.params.cmd}, [DATE] ${Date()}`);
    switch(vTYPE){
        case "status":
        ret = TM.CTokenF_Status();
        
        if(!ret) {
            msg = '[LOCKed] If you use this token, change to "Unlock" mode(default is false).';
            //ret = "Locked";
        } else {
            msg ="[UNLOCKed] you can use Token!!!";
            //ret = "unLocked";
        }
        sCode = 200;
        responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-TOKEN-STATUS", "ID" : 6 }, {"value": ret, "msg": msg}];
        res.status(sCode);
        res.json(responseData);
        console.log(responseData);
        break;
    default:
        console.log("[GET] secret params1: ", req.params);
        break;
    }
})

// [Method] GET, Token: SECRET 
router.get('/secret/:cmd/:address', function(req,res){
    // console.log("req.query: ", req.query);
    // console.log("req.params: ", req.params);
    // console.log("req.url: ", req.url);
    //   console.log('\x1b[33m%s\x1b[0m', `Ether Value: ${balance}, ${Date()}`);  //cyan
    //   console.log('\x1b[36m%s\x1b[0m', `Ether Value: ${balance}, ${Date()}`);  //
    console.log('\x1b[42m%s\x1b[0m', ` Method: GET[4], CMD: ${req.params.cmd}, [DATE] ${Date()}`);
    console.log("Address: ", req.params.address);
    var vTYPE = req.params.cmd;
    switch(vTYPE){
    //     case "network" :
    //         sCode=200;
    //         MyToken = TM.CTokenF_GetInfo();
    //         console.log(MyToken);
    //  //       responseData = [{"Success": (sCode==200? true : false),"Name" : "ETHER-BALANCE", "ID" : 10 }, {"value": ret, "msg": msg}];
    //         res.status(sCode);
    //         res.json(MyToken);
    //         //console.log(responseData);
    //         break;     
        case "balance":
            v_addr = req.params.address;
            ret = TM.CTokenF_getBalance(v_addr,"ether");

            switch(ret) {
                case TM.ERROR_INVALID_ADDRESS:
                    sCode = 400;
                    msg = "[ERROR] Address is not valid format!!!"; 
                    break;
                case TM.ERROR_SYS:
                    msg = "[ERROR] Unknown error";
                    sCode = 406;
                    break;
                default:
                    sCode = 200;
                    msg =  "[GET] Success to get Ether balance";
            }
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-BALANCE", "ID" : 2 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            //console.log(ret, msg);
            //return "{\"msg\":\"success\"}";
            break;
        case "whitelist":
            v_addr = req.params.address;
            ret = TM.CTokenF_CheckList (v_addr);
            switch(ret) {
            case TM.ERROR_INVALID_ADDRESS:
                sCode = 400;
                msg = "[ERROR], Address is not valid format!!!"; 
                break;
            case TM.ERROR_ADDRESS_NOT_IN_WHITELIST:
                sCode = 200;
                msg = "[FAIL], Address is not in white list";
                break;
            case 0:
                sCode = 200;
                msg = "[TRUE], Address is in white list";
                break;
            default:
                sCode = 406;
                msg = "[ERROR] Unknown error ";
                break;
            }
            //console.log(ret, msg);
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-WL-CHECK", "ID" : 3 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            break;

        case "status":
            ret = TM.CTokenF_Status();
            
            if(!ret) {
                msg = '[LOCKed] If you use this token, change to "Unlock" mode(default is false).';
                //ret = "Locked";
            } else {
                msg ="[UNLOCKed] you can use Token!!!";
                //ret = "unLocked";
            }
            sCode = 200;
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-TOKEN-STATUS", "ID" : 6 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            break;

        default:
            console.log("[GET] secret params2: ", req.params);
            break;

    }
});

router.get('/ether/:cmd', function (req, res){
    console.log('\x1b[42m%s\x1b[0m', ` Method: GET[5], CMD: ${req.params}, [DATE] ${Date()}`);
})

// [Method] GET, Token: ETHEREUM 
router.get('/ether/:cmd/:address', function(req,res){
    // console.log("req.query: ", req.query);
    // console.log("req.params: ", req.params);
    // console.log("req.url: ", req.url);
    console.log('\x1b[42m%s\x1b[0m', ` Method: GET[6], CMD: ${req.params.cmd}, [DATE] ${Date()}`);
    console.log("Address: ", req.params.address);
        //console.log(req.body.TYPE);    
    var vTYPE = req.params.cmd;
    switch(vTYPE){

        case "balance":
            v_addr = req.params.address;
            ret = TM.ETH_Balance(v_addr,"ether");

            switch(ret) {
                case TM.ERROR_INVALID_ADDRESS:
                    sCode = 400;
                    msg = "[ERROR] Address is not valid format!!!"; 
                    break;
                case TM.ERROR_SYS:
                    msg = "[ERROR] Unknown error";
                    sCode = 406;
                    break;
                default:
                    sCode = 200;
                    msg =  "[GET] Success to get Ether balance";
            }
            responseData = [{"Success": (sCode==200? true : false),"Name" : "ETHER-BALANCE", "ID" : 10 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            //console.log(ret, msg);
            break;
        
        default:
            console.log("[GET] ether params2: ", req.params);
            break;

    }
});

// [Method] PUT, Token: ETHEREUM 
router.put('/ether/:cmd', function(req,res){
    console.log('\x1b[45m%s\x1b[0m', ` Method: PUT[1], CMD: ${req.params.cmd}, [DATE] ${Date()}`);
    console.log(req.body);

    var vTYPE = req.params.cmd;
    switch(vTYPE){
        case "transfer":
            var Decode_Type = req.body.SIGN; // privateKey or keyStore , 1st verson is only privatekey
            from_pkey = req.body.PKEY;
            to_addr = req.body.TO;
            tmp = req.body.AMOUNT;
            amount = tmp * Math.pow(10, TM.CTokenF_Decimals());
    //        console.log(">>>>", tmp, TM.CTokenF_Decimals());
            ret = TM.ETH_Transfer(from_pkey, to_addr, amount);
            switch(ret) {
                case TM.ERROR_INVALID_ADDRESS:
                    sCode = 400;
                    msg = "[ERROR] Address is not valid format!!!"; 
                    break;
                case TM.ERROR_INVALID_PRIVATEKEY:
                    sCode = 400;
                    msg = "[ERROR] Privatekey is not valid, check!!!: ";
                    break;
                case TM.ERROR_ADDRESS_NOT_IN_WHITELIST:
                    sCode = 400;
                    msg = "[ERROR] Address is not in whitelist or token is locked, After adding address, try again!!!";
                    break;
                case TM.ERROR_NOT_ENOUGH_TOKEN_BALANCE:
                    sCode = 400;
                    msg = "[ERROR] The balance is less than sending amount or empty. check your balance!!! ";
                    break;
                case TM.ERROR_NOT_ENOUGH_ETHER_BALANCE:
                    sCode = 400;
                    msg = "[ERROR] The balance of ETHER is empty. need ETHER for gas fee!!!";
                    break;
                case TM.ERROR_SYS:
                    sCode = 400;
                    msg = "[ERROR] Unknown error";
                    break;
                default:
                    sCode = 200;
                    msg = ">>> txHash Generated !!!";
                    break;
            }
            //console.log(msg);
            responseData = [{"Success": (sCode==200? true : false),"Name" : "ETHER-TRANSFER", "ID" : 11 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            //console.log(ret, msg);
        default:
            console.log(req.body);
            console.log("[PUT] ether default cmd: ", req.params.cmd);
            break;
    }
    // 서버에서는 JSON.stringify 필요없음
});

// [Method] PUT, Token: SECRET 
router.put('/secret/:cmd', function(req,res){
    console.log('\x1b[45m%s\x1b[0m', ` Method: PUT[2], CMD: ${req.params.cmd}, [DATE] ${Date()}`);
    console.log(req.body);

    var vTYPE = req.params.cmd;
    switch(vTYPE){
        case "transfer":
            var Decode_Type = req.body.SIGN; // privateKey or keyStore , 1st verson is only privatekey
            from_pkey = req.body.PKEY;
            to_addr = req.body.TO;
            tmp = req.body.AMOUNT;
            amount = tmp * Math.pow(10, TM.CTokenF_Decimals());
    //        console.log(">>>>", tmp, TM.CTokenF_Decimals());

            ret = TM.CTokenF_Transfer(from_pkey, to_addr, amount);
            switch(ret) {
                case TM.ERROR_INVALID_ADDRESS:
                    sCode = 400;
                    msg = "[ERROR] Address is not valid format!!!"; 
                    break;
                case TM.ERROR_INVALID_PRIVATEKEY:
                    sCode = 400;
                    msg = "[ERROR] Privatekey is not valid, check!!!: ";
                    break;
                case TM.ERROR_ADDRESS_NOT_IN_WHITELIST:
                    sCode = 400;
                    msg = "[ERROR] Address is not in whitelist or token is locked, After adding address, try again!!!";
                    break;
                case TM.ERROR_NOT_ENOUGH_TOKEN_BALANCE:
                    sCode = 400;
                    msg = "[ERROR] The balance is less than sending amount or empty. check your balance!!! ";
                    break;
                case TM.ERROR_NOT_ENOUGH_ETHER_BALANCE:
                    sCode = 400;
                    msg = "[ERROR] The balance of ETHER is empty. need ETHER for gas fee!!!";
                    break;
                case TM.ERROR_SYS:
                    sCode = 400;
                    msg = "[ERROR] Unknown error";
                    break;
                default:
                    sCode = 200;
                    msg = ">>> txHash Generated !!!";
                    break;
            }
           // console.log(msg);
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-TRANSFER", "ID" : 9 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            //console.log(ret, msg);
        default:
            console.log(req.body);
            console.log("[PUT] secret default cmd: ", req.params.cmd);
            break;

    }
    // 서버에서는 JSON.stringify 필요없음
});

router.post('/secret/:cmd', function(req,res){
    console.log('\x1b[44m%s\x1b[0m', ` Method: POST[1], CMD: ${req.params.cmd}, [DATE] ${Date()}`);
    console.log("POST DATA: ", req.body);

    //console.log(req.body);
    //console.log(req.body.TYPE);
    var vTYPE = req.params.cmd;

    switch(vTYPE){
        case "whitelist":           // add address to whitelist
            var v_addr = req.body.ADDRESS;
            ret = TM.CTokenF_AddList(v_addr,TokenConfig.CToken_Owner_PrivateKey);
            switch(ret) {
                case TM.ERROR_INVALID_ADDRESS:
                    sCode = 400;
                    msg = "[ERROR] Address is not valid format!!!"; 
                    break;
                case TM.ERROR_SYS:
                    sCode = 406;
                    msg = "[ERROR] Unknown error";
                    break;
                default:
                    sCode = 200;
                    msg = "[OK] Address added in white list";
                    break;
            }
            //console.log(ret, msg);
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-WL-ADD", "ID" : 4 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);           
            break;
        case "status"   :
            ret = TM.CTokenF_Hold(TokenConfig.CToken_Owner_PrivateKey);
            if(ret == TM.ERROR_SYS) {
                sCode = 406;
                msg = "[ERROR] Unknown error";
            }
            else{
                sCode = 200;
                msg = "[OK] Token is locked(holded)";
            }
            //console.log(ret, msg);
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-TOKEN-LOCK", "ID" : 7 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            break;
        default:
            console.log(req.body);
            console.log("[POST] secret default cmd: ", req.params.cmd);
            break;
    }
    // 서버에서는 JSON.stringify 필요없음
});

router.delete('/secret/:cmd/', function(req,res){
    console.log('\x1b[41m%s\x1b[0m', ` Method: DELETE[1], CMD: ${req.params.cmd}, [DATE] ${Date()}`);

    // console.log("req.query: ", req.query);
    // console.log("req.params: ", req.params);
    // console.log("req.url: ", req.url);
        //console.log(req.body.TYPE);    
    var vTYPE = req.params.cmd;
    switch(vTYPE){
        case "status":
            ret = TM.CTokenF_Release(TokenConfig.CToken_Owner_PrivateKey);
            if(ret == TM.ERROR_SYS) {
                msg = "[ERROR] Unknown error";
            }
            else{
                msg = "[OK] Token is unlocked(released)";
            }
            sCode = 200;
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-TOKEN-UNLOCK", "ID" : 8 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            break;

        default:
            console.log("[DELETE] secret cmd1: ", req.params.cmd);
            break;

    }
});
// [Method] GET, Token: SECRET 
router.delete('/secret/:cmd/:address', function(req,res){
    console.log('\x1b[41m%s\x1b[0m', ` Method: DELETE[2], CMD: ${req.params.cmd}, [DATE] ${Date()}`);
//    console.log("Address: ", req.params.address);

    // console.log("req.query: ", req.query);
    // console.log("req.params: ", req.params);
    // console.log("req.url: ", req.url);
        //console.log(req.body.TYPE);    
    var vTYPE = req.params.cmd;
    switch(vTYPE){

        case "whitelist":
            v_addr = req.params.address;
            ret = TM.CTokenF_RemoveList(v_addr,TokenConfig.CToken_Owner_PrivateKey);
            
            switch(ret) {
                case TM.ERROR_INVALID_ADDRESS:
                    sCode = 400;
                    msg = "[ERROR] Address is not valid format!!!"; 
                    break;
                case TM.ERROR_SYS:
                    sCode = 406;
                    msg = "[ERROR] Unknown error";
                    break;
                default:
                    sCode = 200;
                    msg = "[OK] Address added in white list";
                    break;
            }
            //console.log(ret, msg);
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-WL-REMOVE", "ID" : 5 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            break;

        case "status":
            ret = TM.CTokenF_Release(TokenConfig.CToken_Owner_PrivateKey);
            if(ret == TM.ERROR_SYS) {
                msg = "[ERROR] Unknown error";
            }
            else{
                msg = "[OK] Token is unlocked(released)";
            }
            sCode = 200;
            responseData = [{"Success": (sCode==200? true : false),"Name" : "SECRET-TOKEN-UNLOCK", "ID" : 8 }, {"value": ret, "msg": msg}];
            res.status(sCode);
            res.json(responseData);
            console.log(responseData);
            break;

        default:
            console.log("[DELETE] secret cmd2: ", req.params.cmd);
            console.log("balance-address: ", req.params.address);
            break;

    }
});


// router.all('/', function(req,res){
//     console.log("[ALL]");
// })

exports.router = router;