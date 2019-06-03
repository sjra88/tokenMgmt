const TM = require("./token-module.js");
const TokenConfig = require("../config/TokenConfig");
var web3;
var io;
/*

//서버 소켓 생성
var io = require('socket.io').listen(server);

//소켓 Connection 이벤트 함수
io.on('connection', function(client){
    console.log('Connection: '+ client.id);

    // server receive data from client(클라이언트에서 호출 할 이벤트)    
    client.on('client2server', function(mData){
    //console.log("Server Catched: >>>>>",client.id, mData);
    ret = dispatch(mData, client.id);
    //console.log(">>>>>before sever send data to client: ", ret);
    // server send message to client
    client.emit('server2client', ret);
    });
});
*/
var dispatch = 
function (mDATA, client_id, r_web3, r_io){
    web3 = r_web3;
    io = r_io;
    //console.log(">>>>>>",mDATA);
    var vTYPE = mDATA.TYPE;
    console.log("DISPATCH COMMAND: ",vTYPE);
    switch(vTYPE){
      case "NETWORK" :
      // net = mDATA.NETWORK
      // token = mDATA.TOKEN;
        MyToken = TM.CTokenF_GetInfo();
//            console.log(MyToken[1].Name);
        return MyToken;
        
      case "SECRET-BALANCE" :
        v_addr = mDATA.ADDRESS;
        ret = TM.CTokenF_getBalance(v_addr,"ether");
        // console.log(ret);
        switch(ret) {
            case TM.ERROR_INVALID_ADDRESS:
                msg = "[ERROR], Address is not valid format!!!"; 
                break;
            case TM.ERROR_SYS:
                msg = "[ERROR] Unknown error";
                break;
            default:
                msg =  "[OK] Success to get balance";
        }
        console.log(msg);
        return [{"Name" : "SECRET-BALANCE", "ID" : 2, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
   
      case "SECRET-WL-CHECK"  :
        v_addr = mDATA.ADDRESS;
        ret = TM.CTokenF_CheckList (v_addr);
        switch(ret) {
        case TM.ERROR_INVALID_ADDRESS:
            msg = "[ERROR], Address is not valid format!!!"; 
            break;
        case TM.ERROR_ADDRESS_NOT_IN_WHITELIST:
            msg = "[FAIL], Address is not in white list";
            break;
        case 0:
            msg = "[TRUE], Address is in white list";
            break;
        default:
            msg = "[ERROR] Unknown error ";
            break;
        }
        console.log(msg);
        return [{"Name" : "SECRET-WL-CHECK", "ID" : 3, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
        

      case "SECRET-WL-ADD"    :
        v_addr = mDATA.ADDRESS;
        ret = TM.CTokenF_AddList(v_addr,TokenConfig.CToken_Owner_PrivateKey);
        switch(ret) {
            case TM.ERROR_INVALID_ADDRESS:
                msg = "[ERROR] Address is not valid format!!!"; 
                break;
            case TM.ERROR_SYS:
                msg = "[ERROR] Unknown error";
                break;
            default:
                msg = "[OK] Address added in white list";
                watchTransaction(ret, client_id);
                break;
        }
        console.log(msg);
        return [{"Name" : "SECRET-WL-ADD", "ID" : 4, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
        

      case "SECRET-WL-REMOVE" :
        v_addr = mDATA.ADDRESS;
        ret = TM.CTokenF_RemoveList(v_addr,TokenConfig.CToken_Owner_PrivateKey);
        switch(ret) {
            case TM.ERROR_INVALID_ADDRESS:
                msg = "[ERROR] Address is not valid format!!!"; 
                break;
            case TM.ERROR_SYS:
                msg = "[ERROR] Unknown error";
                break;
            default:
                msg = "[OK] Address added in white list";
                watchTransaction(ret, client_id);
                break;
        }
        console.log(msg);
        return [{"Name" : "SECRET-WL-REMOVE", "ID" : 5, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
    
      case "SECRET-TOKEN-STATUS"   :
        ret = TM.CTokenF_Status();
        
        if(!ret) {
            msg = '[LOCKed] If you use this token, change to "Unlock" mode(default is false).';
            //ret = "Locked";
        } else {
            msg ="[UNLOCKed] you can use Token!!!";
            //ret = "unLocked";
        }
        console.log(msg);
        return [{"Name" : "SECRET-TOKEN-STATUS", "ID" : 6, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
    

      case "SECRET-TOKEN-LOCK"   :
        ret = TM.CTokenF_Hold(TokenConfig.CToken_Owner_PrivateKey);
        if(ret == TM.ERROR_SYS) {
            msg = "[ERROR] Unknown error";
        }
        else{
            msg = "[OK] Token is locked(holded)";
            //console.log(msg);
            watchTransaction(ret, client_id);
        }
        console.log(msg);
        return [{"Name" : "SECRET-TOKEN-LOCK", "ID" : 7, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];

      case "SECRET-TOKEN-UNLOCK" :
        ret = TM.CTokenF_Release(TokenConfig.CToken_Owner_PrivateKey);
        if(ret == TM.ERROR_SYS) {
            msg = "[ERROR] Unknown error";
        }
        else{
            msg = "[OK] Token is unlocked(released)";
            watchTransaction(ret, client_id);
//            watchTransaction(ret);
        }
        console.log(msg);
        return [{"Name" : "SECRET-TOKEN-UNLOCK", "ID" : 8, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
 
      case "SECRET-TRANSFER":
        var Decode_Type = mDATA.SIGN; // privateKey or keyStore , 1st verson is only privatekey
        from = mDATA.ADDRESS;
        from_pkey = mDATA.PKEY;
        to_addr = mDATA.TO;
        tmp = mDATA.AMOUNT;
        //console.log(tmp);
        var amount = tmp * Math.pow(10, CToken_Decimals);
        ret = TM.CTokenF_Transfer(from_pkey, to_addr, amount);
        switch(ret) {
            case TM.ERROR_INVALID_ADDRESS:
                msg = "[ERROR] Address is not valid format!!!"; 
                break;
            case TM.ERROR_INVALID_PRIVATEKEY:
                msg = "[ERROR] Privatekey is not valid, check!!!: ";
                break;
            case TM.ERROR_ADDRESS_NOT_IN_WHITELIST:
                msg = "[ERROR] Address is not in whitelist or token is locked, After adding address, try again!!!";
                break;
            case TM.ERROR_NOT_ENOUGH_TOKEN_BALANCE:
                msg = "[ERROR] The balance is less than sending amount or empty. check your balance!!! ";
                break;
            case TM.ERROR_NOT_ENOUGH_ETHER_BALANCE:
                msg = "[ERROR] The balance of ETHER is empty. need ETHER for gas fee!!!";
                break;
            case TM.ERROR_SYS:
                msg = "[ERROR] Unknown error";
                break;
            default:
                msg = "txHash: "+ret;
                watchTransaction(ret, client_id);
                break;
        }
        console.log(msg);
        return [{"Name" : "SECRET-TRANSFER", "ID" : 9, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
        break;

    case "ETHER-BALANCE":    //ether balance
        v_addr = mDATA.ADDRESS;
        ret = TM.ETH_Balance(v_addr,"ether");

        switch(ret) {
            case TM.ERROR_INVALID_ADDRESS:
                msg = "[ERROR] Address is not valid format!!!"; 
                break;
            case TM.ERROR_SYS:
                msg = "[ERROR] Unknown error";
                break;
            default:
                msg =  "[OK] Success to get balance";
        }
        console.log(msg);
        return [{"Name" : "ETHER-BALANCE", "ID" : 10, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];
        
      case "ETHER-TRANSFER":
        var Decode_Type = mDATA.SIGN; // privateKey or keyStore , 1st verson is only privatekey
        from = mDATA.ADDRESS;
        from_pkey = mDATA.PKEY;
        to_addr = mDATA.TO;
        tmp = mDATA.AMOUNT;

        var amount = tmp * Math.pow(10, 18);
        ret = TM.ETH_Transfer(from_pkey, to_addr, amount);
        switch(ret) {
            case TM.ERROR_INVALID_ADDRESS:
                msg = "[ERROR] Address is not valid format!!!"; 
                break;
            case TM.ERROR_INVALID_PRIVATEKEY:
                msg = "[ERROR] Privatekey is not valid, check!!!: ";
                break;
            case TM.ERROR_ADDRESS_NOT_IN_WHITELIST:
                msg = "[ERROR] Address is not in whitelist or token is locked, After adding address, try again!!!";
                break;
            case TM.ERROR_NOT_ENOUGH_TOKEN_BALANCE:
                msg = "[ERROR] The balance is less than sending amount or empty. check your balance!!! ";
                break;
            case TM.ERROR_NOT_ENOUGH_ETHER_BALANCE:
                msg = "[ERROR] The balance is less than sending amount or empty. check your balance!!! ";
                break;
            case TM.ERROR_SYS:
                msg = "[ERROR] Unknown error";
                break;
            default:
                msg = "txHash: "+ret;
                watchTransaction(ret, client_id);
                break;
        }
        console.log(msg);
        return [{"Name" : "ETHER-TRANSFER", "ID" : 11, "CLIENT_ID": client_id}, {"value": ret, "msg": msg}];

/*
    case "DB-LIST":
        mQuery = mDATA.QUERY+" "+mDATA.PARAM;
         try {
            connection.query(mQuery, function(err, rows, field){
                    row = await 
            });

            rows = connection.(mQuery);
            console.log('The result is: ', rows);    
            //return [{"Name" : "DB-LIST", "ID" : 20, "CLIENT_ID": client_id}, {"value": rows, "msg": "OK"}];
        } catch(err){
            //return [{"Name" : "DB-LIST", "ID" : 20, "CLIENT_ID": client_id}, {"value": "ERR", "msg": err}];
        } 
*/

    }
  }

// async function watchTransaction (txHash, client_id) {
//     var receipt = await getReceipt(txHash);
//     io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 999, "msg": receipt}]);
// }
 
function watchTransaction2(txHash, client_id){
    console.log("----------------watching Transaction!!!-----------------");
    io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 1, "msg": "WAITING"}]);
    filter = web3.eth.filter('latest');
    filter.watch(function(error, result) {
        // XXX this should be made asynchronous as well.  time
        // to get the async library out...
        var receipt = web3.eth.getTransactionReceipt(txHash);
        // XXX should probably only wait max 2 events before failing XXX 
        if (receipt && receipt.transactionHash == txHash) {
    //                  var res = CToken.getData.call();
    //                    console.log('the transactionally incremented data was: ' + res.toString(10));
            filter.stopWatching();
            io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 999, "msg": receipt}]);
            console.log(receipt);
        }
        console.log("filter.watch: ", result);
    });
} 


function watchTransaction(txHash, client_id){
    console.log("----------------watching Transaction!!!-----------------");
    console.log(`txhash=${txHash}`);
    io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 1, "msg": "WAITING"}]);

    // var filterString = 'latest';
    var filter = web3.eth.filter('latest');
    
    filter.watch((err, res) => {
        if (!err) {
            //console.log(`res ${res}`);
            var block = web3.eth.getBlock(res);
            //console.log(`block ${JSON.stringify(block)}`);
            if (block.transactions.includes(txHash)) {
                filter.stopWatching();
                console.log(`>>> ${txHash} completed`);
                var receipt = web3.eth.getTransactionReceipt(txHash);
                console.log(receipt);
                io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 999, "msg": receipt}]);
            }
        } else {
            return err;
        }
    });
}

function watchTransaction3(txHash, client_id){
    console.log("----------------watching Transaction!!!-----------------");
    console.log(`txhash=${txHash}`);
    io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 1, "msg": "WAITING"}]);

    // var filterString = 'latest';
    var filter = web3.eth.filter('latest');
    
    filter.watch((err, res) => {
        if (!err) {
            //console.log(`res ${res}`);
            var block = web3.eth.getBlock(res);
            //console.log(`block ${JSON.stringify(block)}`);
            if (block.transactions.includes(txHash)) {
                filter.stopWatching();
                console.log(`>>> ${txHash} completed`);
                var receipt = web3.eth.getTransactionReceipt(txHash);
                //console.log(receipt);
                io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 999, "msg": receipt}]);
            }
        } else {
            console.log(`err ${err}`);
        }
    });
    //console.log('filter watch');
}


module.exports = {
    dispatch   : dispatch
}