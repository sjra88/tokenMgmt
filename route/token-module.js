const Web3 = require('web3');
const Wallet = require("ethereumjs-wallet");
const Tx = require('ethereumjs-tx');
const _ = require('lodash');
const SolidityFunction = require('web3/lib/web3/function');
const TokenConfig = require("../config/TokenConfig");

//const CryptoJS = require('crypto-js');
//const coder = require('web3/lib/solidity/coder');
// https://www.npmjs.com/package/joi  - npm i joi
//const Joi = require('joi');
//const express = require('express');
//const app = express();
//const util = require("ethereumjs-util");
//var url = require('url');

const ERROR_SYS = -99;                  
const ERROR_INVALID_ADDRESS = -1;
const ERROR_INVALID_PRIVATEKEY = -2;
const ERROR_ADDRESS_NOT_IN_WHITELIST = -3;
const ERROR_NOT_ENOUGH_ETHER_BALANCE = -4;
const ERROR_NOT_ENOUGH_TOKEN_BALANCE = -5;

const STATUS_NOT_MINING = 101;  //ETH Mining status
const STATUS_MINING = 102;      //ETH Mining status
//app.use(express.json());

var web3;
var CHAIN_ID;
var CToken_Address;

var CToken;						
var CToken_ABI;

var CToken_TotalSupply;
var CToken_Symbol;			
var CToken_Name;	
var CToken_Decimals;
var CToken_Status = false;					// custom token release status, true is ready for use, 
var CToken_Balance_Value_WEI =0.0;
var TransactionHash;

var SECRET_TOKEN_INFO;

/* 
var CToken_Balance_Value_ETHER =0.0;
var CToken_Balance_Address;
var CToken_Sender_Address;
var CToken_Receiver_Address;
var CToken_Receiver_Amount =0.0;
var CToken_mintingToken;						// increase totalsupply by this value;
var CToken_burningToken;						// decrease totalSupply by this value;
var PROVIDER_URL;
 */

//function connect_HTTP_Provider(URL) {
var connect_HTTP_Provider = 
function (URL, net_id) {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } 
    else
        web3 = new Web3(new Web3.providers.HttpProvider(URL)); 

    CHAIN_ID = net_id;   
    return web3;
}
	
//function CTokenF_Init(ABI_FILE, Token_Address) {
var CTokenF_Init = 
function (web3_provider, Token_Address, ABI_FILE) {
//    function (web3, ABI_FILE, Token_Address) {
    // networkVersion = web3_provider.version.network;
    // console.log("Current Network : " +  networkVersion);
    var fs = require('fs');
    try {
       ABI = fs.readFileSync(ABI_FILE, 'utf8');
        CToken_ABI = JSON.parse(ABI);

    //    console.log(JSON.parse(T_ABI));
    } catch(err) {
        console.error(err);
        return ERROR_SYS;
    }

    // var customTokenContract =  web3.eth.contract(CToken_ABI);
    var customTokenContract =  web3_provider.eth.contract(CToken_ABI);
    
//var customTokenContract =  web3.eth.contract(JSON.parse(CToken_ABI));
    
    CToken = customTokenContract.at(Token_Address);
    CTokenF_SetInfo(web3_provider,CToken);

    return CToken;
};

var CTokenF_SetInfo =
function (web3_provider, CToken) {
//        function (web3, CToken, Token_Address, Owner_address ) {
    // networkVersion = web3_provider.version.network;
    // console.log("Current Network : " +  networkVersion);
    CToken_Name         = CToken.name();
    CToken_Symbol       = CToken.symbol();
    CToken_Decimals     = CToken.decimals();
    CToken_TotalSupply  = web3_provider.fromWei(CToken.totalSupply(), "ether");

    web3_provider.eth.defaultAccount = TokenConfig.CToken_Owner_Address;
    CToken_Status = CToken.whiteListAll();
     
    var TokenArray = new Array();
    var TokenInfo = new Object();
    var TokenType = new Object();
    TokenType.ID = 1;
    TokenType.Name = "TOKENINFO";
    TokenArray.push(TokenType);

    TokenInfo.Name = CToken_Name;
    TokenInfo.Symbol = CToken_Symbol;
    TokenInfo.Decimals = CToken_Decimals;
    TokenInfo.TotalSupply =CToken_TotalSupply;
    TokenInfo.Status = CToken_Status;
    TokenInfo.TokenAddress = TokenConfig.CToken_Address;
    TokenInfo.TokenOwner = TokenConfig.CToken_Owner_Address;
    TokenInfo.NetID = CHAIN_ID;

    TokenArray.push(TokenInfo);
    CToken_Address = TokenConfig.CToken_Address;
    SECRET_TOKEN_INFO = JSON.stringify(TokenArray);
//    console.log(JsonInfo);

    return SECRET_TOKEN_INFO;

/* 
//[{"Name":"SECRET TOKEN","Symbol":"SECRET","Decimals":"18","TotalSupply":"60000000000","Status":true,"TokenAddress":"0x764Ed0F333E75beDB471700bdC5ebc8764a4089b","TokenOwner":"0x1986652c679bcba5f716d9d1f9fad88d23a0cbc1"}]
    var TokenInfo = `[{
        \"Name\"        :\"${CToken_Name}\",
        \"Symbol\"      :\"${CToken_Symbol}\",
        \"Decimals\"    :\"${CToken_Decimals}\",
        \"TotalSupply\" :\"${CToken_TotalSupply}\",
        \"Status\"      :${CToken_Status},
        \"TokenAddress\":\"${Token_Address}\",
        \"TokenOwner\"  :\"${Owner_address}\"
    }]`;
    console.log(TokenInfo);
    return TokenInfo;
*/
};


var CTokenF_GetInfo =
function () {
    MyToken = JSON.parse(SECRET_TOKEN_INFO);
    MyToken[1].Status = CTokenF_Status();
    return MyToken;
}
var CTokenF_Name =
function() {
    MyToken = JSON.parse(SECRET_TOKEN_INFO);
    return MyToken[1].Name;
}
var CTokenF_Symbol =
function() {
    MyToken = JSON.parse(SECRET_TOKEN_INFO);
    return MyToken[1].Symbol;
}
var CTokenF_Decimals =
function() {
    MyToken = JSON.parse(SECRET_TOKEN_INFO);
    return MyToken[1].Decimals;
}

var CTokenF_Total = 
function (web3_provider,MyToken) {
    return web3_provider.fromWei(MyToken.totalSupply(), "ether");
}

var CTokenF_Status = 
function () {
    CToken_Status = CToken.whiteListAll();
    return CToken_Status;
}

var CTokenF_Release = 
function (Owner_PrivateKey) {
    if(Owner_PrivateKey.substr(0,2) == '0x') Owner_PrivateKey = Owner_PrivateKey.replace('0x', '');

    try{
        Owner_Address = getAddressFromPrivatekey(Owner_PrivateKey);
        //  var gasLimit = getGasLimit('whiteListAllAllow()', 0, CToken_Owner_Address, '', CToken_Address);
        var gasLimit = CToken.whiteListAllAllow.estimateGas();
        var txHash = CTokenF_Transaction(Owner_Address, Owner_PrivateKey, CToken_Address, 'whiteListAllAllow', [], gasLimit); 
        //  CToken.whiteListAllAllow();
        return txHash;
    } catch(error) {
        console.error(error);
        return ERROR_SYS;
    }
}

var CTokenF_Hold = 
function (Owner_PrivateKey) {
    if(Owner_PrivateKey.substr(0,2) == '0x') Owner_PrivateKey = Owner_PrivateKey.replace('0x', '');
    try{
        Owner_Address = getAddressFromPrivatekey(Owner_PrivateKey);
        //  var gasLimit = getGasLimit('whiteListAllNoAllow()', 0, CToken_Owner_Address, '', CToken_Address);
        var gasLimit = CToken.whiteListAllNoAllow.estimateGas();
        var txHash = CTokenF_Transaction(Owner_Address, Owner_PrivateKey, CToken_Address, 'whiteListAllNoAllow', [], gasLimit); 
        //  CToken.whiteListAllNoAllow();
        return txHash;
    } catch(error) {
        console.error(error);
        return ERROR_SYS;
    }
}

var CTokenF_getBalance =
function (v_address, v_type) {
    if(!web3.isAddress(v_address)) return ERROR_INVALID_ADDRESS;

    try {
        CToken_Balance_Value_WEI = CToken.balanceOf(v_address);
        CToken_Balance_Value = web3.fromWei(CToken_Balance_Value_WEI, v_type);
        return CToken_Balance_Value;
    } catch(error) {
            console.error(error);
            CToken_Balance_Value_WEI = -2;
            CToken_Balance_Value = -2;
            return ERROR_SYS;
    }
}

var CTokenF_CheckList = 
function (v_address) {
    console.log("address: ", v_address);
    if(!web3.isAddress(v_address)) return ERROR_INVALID_ADDRESS;
    if(!CToken.whitelist(v_address)) return ERROR_ADDRESS_NOT_IN_WHITELIST;
    return 0;
}

var CTokenF_AddList = 
function (v_address, Owner_PrivateKey) {
    if(Owner_PrivateKey.substr(0,2) == '0x') Owner_PrivateKey = Owner_PrivateKey.replace('0x', '');
    if(!web3.isAddress(v_address)) return ERROR_INVALID_ADDRESS;
    try{
        Owner_Address = getAddressFromPrivatekey(Owner_PrivateKey);
        // CToken.addAddressToWhitelist(value);
        // var gasLimit = getGasLimit('addAddressToWhitelist(address)', cValue, CToken_Owner_Address, '', CToken_Address);
        var gasLimit = CToken.addAddressToWhitelist.estimateGas(v_address);
        var txHash = CTokenF_Transaction(Owner_Address, Owner_PrivateKey, CToken_Address,'addAddressToWhitelist', [v_address],gasLimit);
        return txHash;
    } catch(error) {
        console.error(error);
        return ERROR_SYS;
    }
}
var CTokenF_RemoveList = 
function (v_address, Owner_PrivateKey) {
    if(Owner_PrivateKey.substr(0,2) == '0x') Owner_PrivateKey = Owner_PrivateKey.replace('0x', '');
    if(!web3.isAddress(v_address)) return ERROR_INVALID_ADDRESS;
    try{
        Owner_Address = getAddressFromPrivatekey(Owner_PrivateKey);
        // CToken.removeAddressFromWhitelist(value);
        // var gasLimit = getGasLimit('removeAddressFromWhitelist(address)', cValue, CToken_Owner_Address, '', CToken_Address);
        var gasLimit = CToken.removeAddressFromWhitelist.estimateGas(v_address);
        var txHash = CTokenF_Transaction(Owner_Address, Owner_PrivateKey, CToken_Address,'removeAddressFromWhitelist', [v_address],gasLimit);
        return txHash;
    } catch(error) {
        console.error(error);
        return ERROR_SYS;
    }
}

var CTokenF_Transfer = 
function (from_pkey, to_addr, amount) {
    if(from_pkey.substr(0,2) == '0x') from_pkey = from_pkey.replace('0x', '');
    // console.log("from_key: ", from_pkey);
    // console.log("to_address: ", to_addr);
    // console.log("amount: ", amount);

    try{
        //1. Check validatiion;
        //  1) Address check(to_addrss & from_address);
        if(!web3.isAddress(to_addr)) return ERROR_INVALID_ADDRESS;          //to_address is invalid
        try{
            from_addr = getAddressFromPrivatekey(from_pkey);
        } catch(error){
            return ERROR_INVALID_PRIVATEKEY;
        } 

        //  2) check that addess is in whitelist.
        //      
        CToken_getRelease = CToken.whiteListAll();          // check Token status[Release or hold]
        if(!CToken_getRelease) {                            // if Token is hold, 
            if(!CToken.whitelist(from_addr)) return ERROR_ADDRESS_NOT_IN_WHITELIST;      // address is not in whitelist.
        }

        // 3) check address jave enough the banalce of SECRET Token for transfering;

        CToken_Balance_Value_WEI = CToken.balanceOf(from_addr);
        CToken_Balance_Value  = web3.fromWei(CToken_Balance_Value_WEI, "ether");
        var Sending_Amount = web3.fromWei(amount, "ether");

        console.log("=================================================");
        console.log("From Address   : ", from_addr);
        console.log("Token Balance  : ", toCommas(CToken_Balance_Value.toString()));
        console.log("Sending Amount : ", toCommas(Sending_Amount.toString()));
        console.log("=================================================");

        if (CToken_Balance_Value.toNumber() < Sending_Amount) {
            // console.log("balance is less than amount");                  
            return ERROR_NOT_ENOUGH_TOKEN_BALANCE;
        }
        // else
        //     console.log("balance is greater than amount");

        // 4) check address have enough ethereum for sending gas fee.
        var balance = ETH_Balance(from_addr,"ether");
        if( balance <= 0) {
            console.log("=================================================");
            console.log("ether Balance  : ", balance.toString());
            console.log("Ether is 0, Can NOT tranfer TOKEN ");
    
            return ERROR_NOT_ENOUGH_ETHER_BALANCE;                         //"Ether is 0, Can NOT tranfer TOKEN 
        }

        //2. transfer token.
        //          var gasLimit = getGasLimit('transfer(address, uint256)', amount, from_addr, to_addr, CToken_Address);
        var gasLimit = CToken.transfer.estimateGas(to_addr, amount, {from: from_addr});
        //          var gasLimit = 90000;

        //console.log("gaslimit: "+gasLimit);            
        var txHash = CTokenF_Transaction(from_addr, from_pkey, CToken_Address,'transfer', [to_addr, amount,{from: from_addr} ],gasLimit);

        return txHash;
    } catch(error) {
        console.error(error);
        return ERROR_SYS;
    }
}


function CTokenF_Transaction(FROM_ADDR, FROM_ADDR_PKEY, TOKEN_ADDR, FUNCTION_NAME, ARGS, GAS_LIMIT){
    console.log("From Address   : ", FROM_ADDR);
    console.log("From Addr Pkey : ", FROM_ADDR_PKEY);
    console.log("To(Token) Addr : ", TOKEN_ADDR);
    console.log("Func. name     : ", FUNCTION_NAME);
    console.log("Arguments      : ", ARGS);
    console.log("Gas Limit      : ", toCommas(GAS_LIMIT));

    web3.eth.defaultAccount = FROM_ADDR;

    //var nonce = web3.eth.getTransactionCount(FROM_ADDR);
    var nonce = getNonce(FROM_ADDR);

    console.log("nonce          : ", toCommas(nonce));
    var gasPrice = web3.eth.gasPrice.toNumber(); 
    //    var gasPrice = web3.eth.gasPrice; 
    console.log("gasPrice       : ", toCommas(gasPrice));

    var functionDef = new SolidityFunction('', _.find(CToken_ABI, { "name": FUNCTION_NAME }), '');
    //var functionDef = new SolidityFunction('', _.find(CToken_ABI, { name: 'releaseToken' }), '');
    var payloadData = functionDef.toPayload(ARGS).data;
    //    var payloadData = functionDef.toPayload([]).data;

//    console.log("ARGS's data  : ",ARGS[2].data);
//    console.log("payload data : ",payloadData);

    var gasLimit = GAS_LIMIT; 
    //    var gasLimit = 90000; 
    //    console.log("gasLimit: "+gasLimit);

    var rawTx = { 
        nonce: web3.toHex(nonce), // the count of the number of outgoing transactions, starting with 0 
        gasPrice: web3.toHex(gasPrice), // the price to determine the amount of ether the transaction will cost 
        gasLimit: web3.toHex(gasLimit), // the maximum gas that is allowed to be spent to process the transaction 
    //        gasLimit: web3.toHex(90000), // the maximum gas that is allowed to be spent to process the transaction 
        from: FROM_ADDR, to: TOKEN_ADDR, 
        value: web3.toHex(0), // the amount of ether to send 
        data: payloadData,// could be an arbitrary message or function call to a contract or code to create a contract 
        chainId: CHAIN_ID
    }; 

    var PrivateKey = new Buffer(FROM_ADDR_PKEY, 'hex');
    var tx = new Tx(rawTx); 
    tx.sign(PrivateKey); 
    //    console.log("PKEY      : !!!!"+FROM_ADDR_PKEY+"!!!!");
    //   console.log("PKEY(by Hexa): ",PrivateKey);
    
    var serializedTx = tx.serialize(); 
    //console.log("[[[[Serialized!!!!!!!: "+'0x' + serializedTx.toString('hex')+"!!!!!!!!");

    // var transactionHash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    TransactionHash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    //    console.log("TxHash: "+transactionHash);
//    console.log(`txhash: ${transactionHash}, Wating receipt..................`);
    console.log("================================================");
    // watchTransaction(TransactionHash);

    return TransactionHash;
}

var GetTxResult = 
function (txHash){
    var receipt = web3.eth.getTransactionReceipt(txHash);
    // XXX should probably only wait max 2 events before failing XXX 
    if (receipt && receipt.transactionHash == txHash) 
        return receipt;
    else
        return 0;
}

function getAddressFromPrivatekey(privateKey){
//    console.log("--------------------------------------------------");
//    console.log("input Privatekey: ",privateKey);
    var privateKeyString = new Buffer(privateKey, 'hex');
    const myWallet = Wallet.fromPrivateKey(privateKeyString);
//    const publicKey = myWallet.getPublicKeyString();
    const address = myWallet.getAddressString();
//    console.log("PublicKey: ",publicKey);
//    console.log("Address: ",address);
    return address;
}


function watchTransaction(txHash){
    var count = 0;
    var repeat = setInterval(function(){
        var receipt = web3.eth.getTransactionReceipt(txHash);
        // XXX should probably only wait max 2 events before failing XXX 
        count++;
        if (receipt && receipt.transactionHash == txHash) {
            clearInterval(repeat);
            //console.log(`>>> txHash Registered: ${txHash}\n\r`, receipt);
            console.log(`>>> txHash Registered: ${txHash}\n\r`);
        }
        else
            console.log(`>>> Waiting[${count}] transaction to be registered .......`);
    },3000);
}

function watchTransaction2(txHash){
    console.log("----------------watching Transaction!!!-----------------");
    //console.log(`txhash=${txHash}`);
//    io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 1, "msg": "WAITING"}]);

    // var filterString = 'latest';
    var filter = web3.eth.filter('latest');
    
    filter.watch((err, res) => {
        if (!err) {
            //console.log(`res ${res}`);
            var block = web3.eth.getBlock(res);
            //console.log(`block ${JSON.stringify(block)}`);
            if (block.transactions.includes(txHash)) {
                filter.stopWatching();
                //console.log(`txHash Registered >>> ${txHash}`);
                var receipt = web3.eth.getTransactionReceipt(txHash);
                console.log(`>>> txHash Registered: ${txHash}\n\r`, receipt);
                //io.to(client_id).emit('server2client', [{"Name" : "SECRET-TOKEN-RESULT", "ID" : 100, "CLIENT_ID": client_id}, {"value": 999, "msg": receipt}]);
            }
        } else {
            return err;
        }
    });
}
/* 
function watchTransaction(txHash){
    filter = web3.eth.filter('latest');
    filter.watch(function(error, result) {
        // XXX this should be made asynchronous as well.  time
        // to get the async library out...
        var receipt = web3.eth.getTransactionReceipt(txHash);
        // XXX should probably only wait max 2 events before failing XXX 
        if (receipt && receipt.transactionHash == txHash) {
    //                    var res = CToken.getData.call();
    //                    console.log('the transactionally incremented data was: ' + res.toString(10));
                
                console.log(receipt);
            filter.stopWatching();
        }
    });
} */


// Set recipient address and transfer value first.
function getGasLimit(FUNC_NAME, FUNC_VALUE, from_addr, to_addr, contract_addr ) {
//console.log(FUNC_NAME, FUNC_VALUE, from_addr, to_addr, contract_addr );
    var result;

    let to_address = to_addr;
    let transfer_val = FUNC_VALUE;
    // function signature is the first 4 bytes of the sha3 hash
    //            let function_signature = web3.sha3('transfer(address,uint256)').substring(0,10)
    //                  let function_signature = web3.sha3('releaseToken()').substring(0,10)
    let function_signature = web3.sha3(FUNC_NAME).substring(0,10)
    // we have to make the address field 32 bytes
    let address_param = '0'.repeat(24)+to_address.substring(2)

        // likewise, we have to make the transfer value 32 bytes
    let transfer_value_param = web3.toHex(web3.toBigNumber(transfer_val*Math.pow(10, 18)).toNumber())
    let transfer_value_prefix = '0'.repeat((66 - transfer_value_param.length))
    // combining the function sig and all the arguments
    let transfer_data = function_signature + address_param + transfer_value_prefix + transfer_value_param.substring(2)
    // We are ready to estimateGas with all the data ready.
    //console.log("estimated data: "+ transfer_data);
    result = web3.eth.estimateGas({
        "from": from_addr,
        // token contract address
        "to": contract_addr,
        "data": transfer_data,
    //        gas: web3.eth.gasPrice
    });
    //    console.log(result)
    return result;   
}


/* 
function CTokenF_Tranfer(from_address, from_pwd, to_address, to_amount){
    CToken_Sender_Address = from_address;
    CToken_Receiver_Address = to_address;
    CToken_Receiver_Amount = to_amount * Math.pow(10, CToken_Decimals)
    
    // web3.personal.unlockAccount(from_address,from_pwd,100000);
    
    try {
        var temp = CToken.transfer(CToken_Receiver_Address,CToken_Receiver_Amount,{from: CToken_Sender_Address});
        console.log("Transfering(from: "+CToken_Sender_Address+", to: "+CToken_Receiver_Address+", Amount: "+ CToken_Receiver_Amount);
        console.log("Transfered Result: "+temp);
        return temp;
    }catch(error){
        return error;
    }
};


// var balance;
// function ETHER_getBalance(svc_address){
//     web3.eth.getBalance(svc_address, function(error, balance){
//         if(!error)
//         {
//             var b_value = web3.fromWei(balance, "ether");
//             console.log('ACCOUNT['+idx+'] '+svc_account+': balance is '+b_value);
//             //document.getElementById('Balance').innerHTML = b_value;
//         }
//         else
//             console.error(error);
//     }
// )}



app.use(function(req, res, next){
    res.status(404).send('sorry cant find that');
    //
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));


app.get('/ETH/tx/:id', (req, res) => {
    var account= req.params.id;
//web3.eth.defaultAccount = web3.eth.accounts[0];
//console.log('Account: '+ account);
    var filter = web3.eth.filter({fromBlock:0, toBlock: 'latest', address: account});
    var tx;
    filter.get(function(error, result) {
    if(!error) {
            console.log(result);
            for (i=0; i<result.length; ++i) {
                var block = web3.eth.getBlock(i, true);
                block.transactions.forEach( function(e) {
    //                console.log("  tx hash          : " + e.hash + "\n"
                    tx1 =  "  tx hash          : " + e.hash + "\n"
                    + "   nonce           : " + e.nonce + "\n"
                    + "   blockHash       : " + e.blockHash + "\n"
                    + "   blockNumber     : " + e.blockNumber + "\n"
                    + "   transactionIndex: " + e.transactionIndex + "\n"
                    + "   from            : " + e.from + "\n" 
                    + "   to              : " + e.to + "\n"
                    + "   value           : " + e.value + "\n"
                    + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
                    + "   gasPrice        : " + e.gasPrice + "\n"
                    + "   gas             : " + e.gas + "\n"
                    + "   input           : " + web3.toAscii(e.input)+"\n"; 
    //                + "   input           : " + web3.toAscii(e.input))+"\n"; 
                    console.log(tx);
                    web3.eth.filter.stopWatching();
                    res.send(tx);
                    return;
                })
            }

    }
    else {
        tx = error;
        console.log('Error: '+error);
    }
    res.send(tx);

    });
});

 */


/*
// Delete
app.delete('/api/courses/:id', (req, res)=>{
    // Look up the course
    // Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID  was not found');// 404 object not found
 
    // delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //return the same course
    res.send(course);
});
 
//app.delete();

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}
*/

var ETH_Mining = 
function () {
//    networkVersion = web3.version.network;
//    console.log("Current Network : " +  networkVersion);
        
    if(!web3.eth.mining) return STATUS_NOT_MINING;      // -1;
    return STATUS_MINING;
}

var ETH_Coinbase = 
function () {
    return web3.eth.coinbase;
}

var ETH_Balance = 
function (v_address, v_type) {
//    console.log(v_address);
    if(!web3.isAddress(v_address)) return ERROR_INVALID_ADDRESS;          //to_address is invalid
    try {
        var ETHER_Balance_Value_WEI = web3.eth.getBalance(v_address);
        var ETHER_Balance_Value = web3.fromWei(ETHER_Balance_Value_WEI, v_type);
        return ETHER_Balance_Value;
    } catch(error) {
            console.error(error);
            return ERROR_SYS;
    }
}

function ETHER_getBalance(v_address, v_type) {
    try {
        ETHER_Balance_Value_WEI = web3.eth.getBalance(v_address);
        ETHER_Balance_Value = web3.fromWei(ETHER_Balance_Value_WEI, v_type);
        return ETHER_Balance_Value;
    } catch(error) {
            console.error(error);
            ETHER_Balance_Value_WEI = -1;
            ETHER_Balance_Value = -1;
            return -99;
    }
}

var ETH_Transfer = 
function (from_pkey, to_addr, amount) {
    // console.log("from_key: ", from_pkey);
    // console.log("to_address: ", to_addr);
    // console.log("amount: ", amount);
    if(from_pkey.substr(0,2) == '0x') from_pkey = from_pkey.replace('0x', '');
    try{
        //1. Check validatiion;
        //  1) Address check(to_addrss & from_address);
        if(!web3.isAddress(to_addr)) return ERROR_INVALID_ADDRESS;          //to_address is invalid
        try{
            from_addr = getAddressFromPrivatekey(from_pkey);
        } catch(error){
            return ERROR_INVALID_PRIVATEKEY;
        } 
        web3.eth.defaultAccount = from_addr;
        // 2) check address have enough ethereum for sending gas fee.
        var balance = ETH_Balance(from_addr,"ether");

        var sendAmount = web3.fromWei(amount, 'ether');
        console.log("=================================================");
        console.log("From Address   : ", from_addr);
        console.log("Ether Balance  : ", toCommas(balance.toString()));
        console.log("Sending Amount : ", toCommas(sendAmount.toString()));
        console.log("=================================================");
        if( balance <= 0) return ERROR_NOT_ENOUGH_ETHER_BALANCE;                         //"Ether is 0, Can NOT tranfer TOKEN      
        if (balance.toNumber() < sendAmount) {
            // console.log("balance is less than amount");
            return ERROR_NOT_ENOUGH_TOKEN_BALANCE;
        }
        // else
        //     console.log("balance is greater than amount");

        //          var gasLimit = getGasLimit('transfer(address, uint256)', amount, from_addr, to_addr, CToken_Address);
        var gasLimit = web3.eth.estimateGas({to: to_addr, value: amount, from: from_addr});
        //          var gasLimit = 90000;
        //console.log("gaslimit: "+gasLimit);

        var txHash = ETHER_Transaction(from_addr, from_pkey, to_addr, amount, gasLimit);

        return txHash;

    } catch(error) {
        console.error(error);
        return ERROR_SYS;
    }
}
/* 
function ETHER_Transfer(from_address, from_pwd, to_address, to_amount) {
    //var accounts = web3.eth.accounts;  //account 정보 가져오기
    //    var from_account = accounts[0];
    //    var to_account = accounts[1];

    var transactionObj = { //transaction object 설정
            from: from_account,
            to:to_address,
//            gas: "0x01",
            value: to_amount
    };
    web3.personal.unlockAccount(from_address,from_pwd,100000);

    web3.eth.sendTransaction(transactionObj, function(err, res){
        if(err) {
            console.log(err);
        }
        else{
            //res
        }
    });
}
 */
function ETHER_Transaction(FROM_ADDR, FROM_ADDR_PKEY, TO_ADDR, AMOUNT, GAS_LIMIT){
    console.log("From Address   : ", FROM_ADDR);
    console.log("From Addr Pkey : ", FROM_ADDR_PKEY);
    console.log("To Address     : ", TO_ADDR);
    console.log("Gas Limit      : ", toCommas(GAS_LIMIT));

    //var nonce = web3.eth.getTransactionCount(FROM_ADDR);
    var nonce = getNonce(FROM_ADDR);
    console.log("nonce          : ",toCommas(nonce));
    var gasPrice = web3.eth.gasPrice.toNumber(); 
    //    var gasPrice = web3.eth.gasPrice; 
    console.log("gasPrice       : ",toCommas(gasPrice));

    var gasLimit = GAS_LIMIT; 

    var rawTx = { 
        nonce: web3.toHex(nonce), // the count of the number of outgoing transactions, starting with 0 
        gasPrice: web3.toHex(gasPrice), // the price to determine the amount of ether the transaction will cost 
        gasLimit: web3.toHex(gasLimit), // the maximum gas that is allowed to be spent to process the transaction 
    //        gasLimit: web3.toHex(90000), // the maximum gas that is allowed to be spent to process the transaction 
        from: FROM_ADDR, to: TO_ADDR, 
        value: web3.toHex(AMOUNT), // the amount of ether to send 
        data: "",
        chainId: CHAIN_ID
    }; 

    var PrivateKey = new Buffer(FROM_ADDR_PKEY, 'hex');
    //    console.log("PKEY      : ", FROM_ADDR_PKEY);
    //    console.log("PKEY(Hexa): ", PrivateKey);
    var tx = new Tx(rawTx); 
    tx.sign(PrivateKey); 

    //console.log("PrivateKey by Hexa: "+PrivateKey);
    var serializedTx = tx.serialize(); 
    //    console.log("KKKKKK: ", '0x' + serializedTx.toString('hex'));
    //           var transactionHash = CToken.ReleaseToken.sendRawTransaction('0x' + serializedTx.toString('hex'));
    // var transactionHash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    TransactionHash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    //    console.log("TxHash: "+transactionHash);
    // console.log(`txhash: ${transactionHash}, Wating receipt..................`);
    console.log("================================================");
    // watchTransaction(TransactionHash);
    return TransactionHash;
}


function getNonce(ethereumAddress){
    //    var lastTxHash = getLatestTx(ethereumAddress);
    //    console.log("lastTxHash: ", lastTxHash);
        lastTxHash = TransactionHash;
        if (lastTxHash) {
            var tx = web3.eth.getTransaction(lastTxHash);
            var txCount = web3.eth.getTransactionCount(ethereumAddress);
//            var txCount = web3.eth.getTransactionCount(ethereumAddress, 'pending');
            if (tx) {
                nonce = txCount > (tx.nonce + 1) ? txCount + 1 : tx.nonce + 1;
            } else if (txCount === 0) {
              nonce = 0;
            } else {
              nonce = txCount + 1;
            }
        } else {
            nonce = web3.eth.getTransactionCount(ethereumAddress);
        }
        //console.log("txCount: ", txCount);
        //console.log("nonce: ", nonce);
        return nonce;
  }
    

//    function showTokenInfo(web3_provider, TokenObj) {
//    var TokenInfo = TM.CTokenF_Info(web3_provider, TokenObj,CToken_Address, CToken_Owner_Address);		    // Token initialize
var showERC20TokenInfo = 
function (WEB3_PROVIDER, ERC20Token) {
    //var TokenInfo = CTokenF_SetInfo(WEB3_PROVIDER, ERC20Token);		    // Token initialize
    //MyToken = JSON.parse(TokenInfo);
    MyToken = JSON.parse(SECRET_TOKEN_INFO);

    CToken_Name     = MyToken[1].Name;	
    CToken_Symbol   = MyToken[1].Symbol;			
    CToken_Decimals = MyToken[1].Decimals;
    CToken_TotalSupply = MyToken[1].TotalSupply;

    switch(TokenConfig.CHAIN_ID){
        case 1:
            msg = "Token.Network      :  1 ( Ethereum MainNET )"; break;
        case 3:
            msg = "Token.Network      :  3 ( Ethereum Testnet - Ropsten )"; break;
        case 4:
            msg = "Token.Network      :  4 ( Ethereum Testnet - Rinkerby )"; break;
        case 42:
            msg = "Token.Network      :  43 ( Ethereum Testnet - Kovan )"; break;
        default:
            msg = `Token.Network      :  ${TokenConfig.CHAIN_ID} ( PRIVATE Net )`; break;
    }

    console.log(msg);
    console.log("Token.name         : ",CToken_Name);
    console.log("Token.symbol       : ",CToken_Symbol);
    console.log("Token.decimals     : ",CToken_Decimals);
    console.log(`Token.totalsupply  :  ${toCommas(CToken_TotalSupply)} SECRET`);
    console.log("Token.Address      : ",TokenConfig.CToken_Address);
    //    web3.eth.defaultAccount = web3.eth.accounts[0];
    console.log("Token.Owner        : ",TokenConfig.CToken_Owner_Address );
    console.log("Token.unlock Status: ",MyToken[1].Status);
    if(!MyToken[1].Status) msg = "Token is Locked, change to unlock mode or add address to whitelist!!!";
    else msg = "Token is unlocked. you can send Token to anyone freely!!!";
    console.log(msg);

    //web3.personal.unlockAccount(CToken_Owner_Address, 'kms2019@kmscom.com', 100000);
};

function toCommas(value) {
    //    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var parts = value.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
}

web3 = connect_HTTP_Provider(TokenConfig.PROVIDER_URL, TokenConfig.CHAIN_ID);

if(!web3.isConnected()) {
    console.log("==========================================================================================")
    console.log(`Not connected!!!, PROVIDER: ${TokenConfig.PROVIDER_URL}, CHAIN ID: ${TokenConfig.CHAIN_ID}`);
    console.log("After check Ethereum-Network, restart again!!!");
    console.log("==========================================================================================")
} else {
    console.log("==========================================================================================")
    console.log(`Connected!!!, PROVIDER: ${TokenConfig.PROVIDER_URL}, CHAIN ID: ${TokenConfig.CHAIN_ID}`);
    console.log("==========================================================================================")
   // start web3 filters, calls, etc
   CToken = CTokenF_Init(web3, TokenConfig.CToken_Address, "Token.abi.json");
   // //var MyToken = TM.CTokenF_Init(web3_provider, "Token.abi.json", CToken_Address);
   showERC20TokenInfo(web3, CToken); 
}

module.exports = {
    connect_HTTP_Provider   : connect_HTTP_Provider,
    CTokenF_Init            : CTokenF_Init,
    CTokenF_SetInfo         : CTokenF_SetInfo,
    CTokenF_GetInfo         : CTokenF_GetInfo,
    CTokenF_Total           : CTokenF_Total,
    CTokenF_Status          : CTokenF_Status,
    CTokenF_Release         : CTokenF_Release,
    CTokenF_Hold            : CTokenF_Hold,
    CTokenF_getBalance      : CTokenF_getBalance,
    CTokenF_CheckList       : CTokenF_CheckList,
    CTokenF_AddList         : CTokenF_AddList,
    CTokenF_RemoveList      : CTokenF_RemoveList,
    CTokenF_Transfer        : CTokenF_Transfer,
    ETH_Mining              : ETH_Mining,
    ETH_Coinbase            : ETH_Coinbase,
    ETH_Balance             : ETH_Balance,
    ETH_Transfer            : ETH_Transfer,
    showERC20TokenInfo      : showERC20TokenInfo,
    GetTxResult             : GetTxResult,
    CTokenF_Symbol	        : CTokenF_Symbol,		
    CTokenF_Name	        : CTokenF_Name,
    CTokenF_Decimals        : CTokenF_Decimals,
    SECRET_TOKEN_INFO       : SECRET_TOKEN_INFO,

    // for constant;
    ERROR_SYS               : ERROR_SYS,
    ERROR_INVALID_ADDRESS   : ERROR_INVALID_ADDRESS,
    ERROR_INVALID_PRIVATEKEY: ERROR_INVALID_PRIVATEKEY,
    ERROR_ADDRESS_NOT_IN_WHITELIST :    ERROR_ADDRESS_NOT_IN_WHITELIST,
    ERROR_NOT_ENOUGH_ETHER_BALANCE :    ERROR_NOT_ENOUGH_ETHER_BALANCE,
    ERROR_NOT_ENOUGH_TOKEN_BALANCE :    ERROR_NOT_ENOUGH_ETHER_BALANCE,
    STATUS_NOT_MINING       : STATUS_NOT_MINING,
    STATUS_MINING           : STATUS_MINING
    
};
