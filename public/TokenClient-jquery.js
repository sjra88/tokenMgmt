//import { userInfo } from "os";

var etherScan_url = 'https://ropsten.etherscan.io/tx/';
var TokenHolderList = [];
var UserBalance = [];
function dispatch(data) {
  switch(data[0].Name){
    case "TOKENINFO":
      $('#L_NETID').html(       "<div class='block_title'><b>Chain ID</b>      </div>&nbsp;&nbsp;"+data[1].NetID);
      $('#L_NAME').html(        "<div class='block_title'><b>Name</b>          </div>&nbsp;&nbsp;"+data[1].Name);
      $('#L_SYMBOL').html(      "<div class='block_title'><b>Symbol</b>        </div>&nbsp;&nbsp;"+data[1].Symbol);
      $('#L_DECIMALS').html(    "<div class='block_title'><b>Decimals</b>      </div>&nbsp;&nbsp;"+data[1].Decimals);
      $('#L_TOTAL').html(       "<div class='block_title'><b>TotalSupply</b>   </div>&nbsp;&nbsp;"+toCommas(data[1].TotalSupply));
      $('#L_STATUS').html(      "<div class='block_title'><b>Token Status</b>  </div>&nbsp;&nbsp;"+(data[1].Status==false ? 'Locked': 'unLocked'));
      $('#L_TOKEN_ADDR').html(  "<div class='block_title'><b>Token Address</b> </div>&nbsp;&nbsp;"+data[1].TokenAddress);
      $('#L_TOKEN_OWNER').html( "<div class='block_title'><b>Token Owner</b>   </div>&nbsp;&nbsp;"+data[1].TokenOwner); 
      break;
    case "SECRET-BALANCE":
      $('#ID-Balance_result').val(toCommas(data[1].value));
      $('#ID-Balance_msg').val(toCommas(data[1].msg));
      break;
    case "SECRET-WL-CHECK":
      $('#ID-WhiteList_result').val(data[1].value==0 ? 'Added in WhiteList' : 'Not in WhiteList');
      $('#ID-WhiteList_msg').val(data[1].msg);
      break;
    case "SECRET-WL-ADD":
      $('#ID-WhiteList_result').val(data[1].value);
      $('#ID-WhiteList_msg').val(data[1].msg);
      break;
    case "SECRET-WL-REMOVE":
      $('#ID-WhiteList_result').val(data[1].value);
      $('#ID-WhiteList_msg').val(data[1].msg);
      break;
    case "SECRET-TOKEN-STATUS":
      $('#ID-TokenLock_result').val((data[1].value ==false ? 'Locked': 'unLocked'));
      $('#ID-TokenLock_msg').val(data[1].msg);
      break;
    case "SECRET-TOKEN-LOCK":
      $('#ID-TokenLock_result').val(data[1].value);
      $('#ID-TokenLock_msg').val(data[1].msg);
      break;
    case "SECRET-TOKEN-UNLOCK":
      $('#ID-TokenLock_result').val(data[1].value);
      $('#ID-TokenLock_msg').val(data[1].msg);
      break;
    case "SECRET-TRANSFER":
      $('#ID-tx_result').val(data[1].value);
      $('#ID-tx_msg').val(data[1].msg);
      break;
    case "ETHER-BALANCE":
      $('#ID-ETHER_Balance_result').val(toCommas(data[1].value));
      $('#ID-ETHER_Balance_msg').val(toCommas(data[1].msg));
      break;
    case "ETHER-TRANSFER":
      $('#ID-ETHER_tx_result').val(data[1].value);
      $('#ID-ETHER_tx_msg').val(data[1].msg);
      break;
    case "TXHASH-RESULT":
      if(data[1].value == 1) {
        var txt = `
        
        ---------------- Waiting Transaction to be registered !!! ---------------------
        
        TxHash: ${data[1].msg}
        `;

      } else if(data[1].value == -1){
          var txt = data[1].msg;
      }else{
    
      var txt = `
      TxHash          : ${data[1].msg.transactionHash}
      From            : ${data[1].msg.from}
      To              : ${data[1].msg.to}
      ContractAddress : ${data[1].msg.contractAddress}
      BlockNumber     : ${data[1].msg.blockNumber}
      GasUsed         : ${data[1].msg.gasUsed}
      Status          : ${data[1].msg.status}
      `;
      //TxHashIndex     : ${data[1].msg.transactionIndex}

      $('#L_TXMSG').html(`Transaction message: <a href=${etherScan_url}/${data[1].msg.transactionHash} target="_blank">Goto Tx Page</a>`);
      }
      $('#ID-TxResult').val(txt);
      break;
    case "TOKEN-HOLDER":
      TokenHolderList = JSON.parse(data[1].value);
      // console.log("value length: ", TokenHolderList.length);
      // console.log("Address[0]", TokenHolderList[0].Address);
      for(var i = 0; i < TokenHolderList.length; i++){
        $("#ID-TokenHolder_E_B").append(`<option value=${TokenHolderList[i].Address}>${TokenHolderList[i].Holdername}</option>`);
        $("#ID-TokenHolder_E_T").append(`<option value=${TokenHolderList[i].Privatekey}>${TokenHolderList[i].Holdername}</option>`);
        $("#ID-TokenHolder_S_W").append(`<option value=${TokenHolderList[i].Address}>${TokenHolderList[i].Holdername}</option>`);
        $("#ID-TokenHolder_S_B").append(`<option value=${TokenHolderList[i].Address}>${TokenHolderList[i].Holdername}</option>`);
        $("#ID-TokenHolder_S_T").append(`<option value=${TokenHolderList[i].Privatekey}>${TokenHolderList[i].Holdername}</option>`);
        $("#ID-HolderList-TABLE > tbody:first").append(`<tr ${i%2==0?'class=even':''}><td>${TokenHolderList[i].Holdername}</td>
        <td>${TokenHolderList[i].Address}</td><td align=right>${toCommas(TokenHolderList[i].SECRET_init)}</td></tr>`);
      }      
      break;
    case "USER-BALANCE-E":
      //console.log(data[1]);
      $("#ID-User-Balance-E").html(`Current Balance of ETHER: ${toCommas(data[1].value.ETHER)}`);
      break;

    case "USER-BALANCE-S":
      //console.log(data[1]);
      $("#ID-User-Balance-S").html(`Current Balance of SECRET: ${toCommas(data[1].value.SECRET)}, and ETHER: ${toCommas(data[1].value.ETHER)}`);
      break;
    case "USER-BALANCE-LIST":
      ret_list = JSON.parse(data[1].value);
      // console.log("USER Balance List");
      // console.log("get list length: ", ret_list.length);
      // console.log("get list [0]: ", ret_list[0]);
      var colctr = $('#ID-HolderList-TABLE').find('th').length;
      $("#ID-HolderList-TABLE tr:not(:first)").remove();  // tablename이라는 ID를 가진 Table의 첫번째 행을 제외하고 모두 제거
      if (colctr < 5){
        $('#ID-HolderList-TABLE').find('tr').each(function(){
          $(this).find('th').eq(2).after('<th scope="cols" >현재SECRET</th><th scope="cols"  >현재ETHER</th>');
        });  
      }
      if (ret_list.length == TokenHolderList.length) {
        for(var i = 0; i < ret_list.length; i++){
          ret = ret_list.find(c => c.ADDRESS === TokenHolderList[i].Address);
          $("#ID-HolderList-TABLE > tbody:first").append(`<tr ${i%2==0?'class=even':''}><td>${TokenHolderList[i].Holdername}</td>
          <td>${TokenHolderList[i].Address}</td><td align=right>${toCommas(TokenHolderList[i].SECRET_init)}</td>
          <td align=right>${toCommas(ret.SECRET)}</td><td align=right>${toCommas(ret.ETHER)}</td>
          </tr>`);
        }      
      }
      $("#ID-GET-USER-LIST").val("get Balance List from Ethereum");
    
      break;


    case "DB-LIST" :
      alert("!!!DB-LIST: "+ data[0].id+", "+data[1].value+", "+data[1].msg);
      if(data[1].value == "ERR") break;
      var txt = "listen!!!!!";
      // var txt = `<table>
      // <tr><td>Email</td><td>Phone</td><td>Address</td><td>Privatekey</td><td>lock YN</td><td>OTP YN</td><td>Create Date</td></tr>
      // <tr><td>${data[1].value[0].email}</td><td>${data[1].value[0].RegCode}-${data[1].value[0].PhoneNum}</td><td>${data[1].value[0].ethereumAddress}
      // </td><td>${data[1].value[0].privateKey}</td><td>${data[1].value[0].lockYn}</td><td>${data[1].value[0].otpYn}</td><td>${data[1].value[0].regDate}</td></tr>
      // <tr><td>${data[1].value[1].email}</td><td>${data[1].value[1].RegCode}-${data[1].value[1].PhoneNum}</td><td>${data[1].value[1].ethereumAddress}
      // </td><td>${data[1].value[1].privateKey}</td><td>${data[1].value[1].lockYn}</td><td>${data[1].value[1].otpYn}</td><td>${data[1].value[1].regDate}</td></tr>
      // <tr><td>${data[1].value[2].email}</td><td>${data[1].value[2].RegCode}-${data[1].value[2].PhoneNum}</td><td>${data[1].value[2].ethereumAddress}
      // </td><td>${data[1].value[2].privateKey}</td><td>${data[1].value[2].lockYn}</td><td>${data[1].value[2].otpYn}</td><td>${data[1].value[2].regDate}</td></tr>
      // </table> `;
      $('#ID-DATAResult').html(txt);
      break;

    default:
      alert("Invalid name: "+data[0].Name);
      break;
  }   

};

var TOKEN_BASE_URL = "http://localhost:3000/token";
var DB_BASE_URL = "http://localhost:3000/db";


function Send2Server(TYPE, OPT) {
  //alert(TYPE);
  switch(TYPE){
    case "NETWORK":             // Method: GET
      //socket.emit('client2server', {TYPE: "NETWORK", NETWORK: "RESERVED", TOKEN: "SECRET"});
      sub_url ="/secret";
      params="";
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
      break;
    case "SECRET-BALANCE":      // Method: GET
      TxtValue = $('#ID-Balance_address').val();
      sub_url ="/secret/balance/"+TxtValue;
      params="";
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params,"GET");
      //socket.emit('client2server', {TYPE: "SECRET-BALANCE", ADDRESS: TxtValue});
      break;
    case "SECRET-TRANSFER":     // Method: PUT
      selectValue = $('#ID-txType').val();
      TxtFrom = $('#ID-tx_from').val();
      TxtTo = $('#ID-tx_to').val();
      TxtValue = $('#ID-tx_value').val();
      //socket.emit('client2server', {TYPE: "SECRET-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
      sub_url = "/secret/transfer";
      data = {SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue};
      sendAjax(TOKEN_BASE_URL, sub_url, data, "PUT");
      break;
    case "SECRET-WL-CHECK":     // Method: GET
      // alert("SECRET-WL-CHECK");
      TxtValue = $('#ID-WhiteList_address').val();
      sub_url ="/secret/whitelist/"+TxtValue;
      params="";
      //socket.emit('client2server', {TYPE: selectValue, ADDRESS: TxtValue});
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
      break;
    case "SECRET-WL-ADD":       // Method: POST
      // alert("SECRET-WL-ADD");
      TxtValue = $('#ID-WhiteList_address').val();
      sub_url ="/secret/whitelist/";
      data = {ADDRESS: TxtValue};
      //socket.emit('client2server', {TYPE: selectValue, ADDRESS: TxtValue});
      sendAjax(TOKEN_BASE_URL, sub_url, data, "POST");
      break;
    case "SECRET-WL-REMOVE":    // Method: DELETE
      // alert("SECRET-WL-REMOVE");
      TxtValue = $('#ID-WhiteList_address').val();
      sub_url ="/secret/whitelist/"+TxtValue;
      params = "";
      //socket.emit('client2server', {TYPE: selectValue, ADDRESS: TxtValue});
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "DELETE");      
      break;
    case "SECRET-TOKEN-LOCK":   //  Method: POST
      // alert("SECRET-TOKEN-LOCK");
      sub_url ="/secret/status/";
      data = {};
      sendAjax(TOKEN_BASE_URL, sub_url, data, "POST");
      // selectValue =$('#ID-TokenLock').val();
      // socket.emit('client2server', {TYPE: selectValue});
      break;

    case "SECRET-TOKEN-UNLOCK": // Method: DELETE
      // alert("SECRET-TOKEN-UNLOCK");
      sub_url ="/secret/status/";
      params = "";
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "DELETE");
      // selectValue =$('#ID-TokenLock').val();
      // socket.emit('client2server', {TYPE: selectValue});
      break;

    case "SECRET-TOKEN-STATUS": // Method: GET
      // alert("SECRET-TOKEN-STATUS");
      sub_url ="/secret/status/";
      params= ""
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
      // selectValue =$('#ID-TokenLock').val();
      // socket.emit('client2server', {TYPE: selectValue});
      break;
  
    case "ETHER-TRANSFER":
      selectValue = $('#ID-ETHER_txType').val();
      TxtFrom = $('#ID-ETHER_tx_from').val();
      TxtTo = $('#ID-ETHER_tx_to').val();
      TxtValue = $('#ID-ETHER_tx_value').val();
      //socket.emit('client2server', {TYPE: "ETHER-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
      sub_url = "/ether/transfer";
      data = {SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue};
      sendAjax(TOKEN_BASE_URL, sub_url, data, "PUT");
      break;
      
    case "ETHER-BALANCE":        // Method: GET
      TxtValue = $('#ID-ETHER_Balance_address').val();
      sub_url ="/ether/balance/"+TxtValue;
      params="";
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
      //socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
      break;

    case "TX-RESULT":
      TxtValue = "txHash";
      sub_url ="/"+TxtValue+"/"+OPT;
      params="";
      //alert(sub_url);
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
      //socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
      break;

    case "GET-TOKEN-HOLDER":
      sub_url = "/tokenholder";
      params="";
      if(TokenHolderList.length !== 0){
        console.log("Already got TokenHolder!!!, Length: ", TokenHolderList.length);
      } else
        sendAjax_GET(DB_BASE_URL, sub_url, params, "GET");
        break;

    case "USER-BALANCE-E":
      TxtValue = $('#ID-ETHER_tx_from').val();
      ret = TokenHolderList.find(c => c.Privatekey === TxtValue);
      //console.log("ret: ", ret);
      console.log("get Address for Ether balance : ", ret.Address);
      sub_url ="/"+ret.Address;
      params="?Token=E";
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
      break;
       
    case "USER-BALANCE-S":
      TxtValue = $('#ID-tx_from').val();
      ret = TokenHolderList.find(c => c.Privatekey === TxtValue);
      //console.log("ret: ", ret);
      console.log("get Address for Ether&SECRET balance", ret.Address);
      sub_url ="/"+ret.Address;
      params="?Token=S";
      sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
      break;

    case "USER-BALANCE-LIST":
      sub_url ="/HolderBalance";
      data=OPT;
      //alert(data);
      sendAjax(TOKEN_BASE_URL, sub_url, data, "PUT");
      break;
  }
}

function get_user_balance(){
  console.log("get user balance list!!!!!", TokenHolderList.length);

  $("#ID-GET-USER-LIST").val("Waiting for getting date from Ethereum...");
  var AddrList = [];
  for(var i = 0; i < TokenHolderList.length; i++){
    AddrList.push(TokenHolderList[i].Address);
  }
  Send2Server("USER-BALANCE-LIST", AddrList);
  var cnt = 0;
  repeat = setInterval(function(){
      if( $("#ID-GET-USER-LIST").val() == "get Balance List from Ethereum"){
        clearInterval(repeat);
      }
      else {
        cnt++;
        $("#ID-GET-USER-LIST").val(`[${cnt}] sec, waiting for date from Ethereum...`);
      }
  },1000);

}

function sendAjax(BASE_URL, sub_url, data, METHOD){
  str_data = JSON.stringify(data);
  url = BASE_URL+sub_url;
  var xhr = new XMLHttpRequest();
  xhr.open(METHOD, url);
  xhr.setRequestHeader('Content-type', "application/json");
  xhr.send(str_data);
  xhr.onload = function(){
    var result = JSON.parse(xhr.responseText);
    dispatch(result); 
    // if (xhr.status >= 200 && xhr.status < 400) {
    //   var result = JSON.parse(xhr.responseText);
    //   dispatch(result);  
    // } else {
    //   console.log("Connected to the server, but it returned an error!!!", xhr.status);
    // }
  }
  xhr.onerror = function(){
    console.error("Cannot Connect to server!!!");
  }


  // xhr.addEventListener('load', function(){
  //   var result = JSON.parse(xhr.responseText);
  //   // console.log("===============================");
  //   // console.log("Received: ", xhr.responseText);
  //   // console.log("===============================");
  //   // console.log("Received2: ", result[0].Name);
  //   // console.log("Received3: ", result[1].value);
  //   // console.log("Received4: ", result[1].msg);
  //   dispatch(result);
  // });
}

function sendAjax_GET(BASE_URL, sub_url, params, METHOD)  {
  //console.log(sub_url);
  url = BASE_URL+sub_url+params;
  var xhr = new XMLHttpRequest();
  xhr.open(METHOD, url);
  xhr.setRequestHeader('Content-type', "application/json");
  xhr.send();
  xhr.onload = function(){
    var result = JSON.parse(xhr.responseText);
    dispatch(result);  

    // if (xhr.status >= 200 && xhr.status < 400) {
    //   var result = JSON.parse(xhr.responseText);
    //   dispatch(result);  
    // } else {
    //   console.log("Connected to the server, but it returned an error!!!", xhr.status);
    // }
  }
  //  xhr.onreadystatechange = function(){
  //   if(xhr.readyState ===4 && xhr.status === 200){
  //     var result = JSON.parse(xhr.responseText);
  //     dispatch(result);
  //   }
  // }
  xhr.onerror = function(){
    console.error("Cannot Connect to server!!!");
  }
 
}

// utility
function toCommas(value) {
  //    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      var parts = value.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
}

