/*

var socket;
window.onload = function(){ 
 //클라이언트 소켓 생성
 socket = io.connect('ws://127.0.0.1:3000');

 //클라이언트 receive 이벤트 함수(서버에서 호출할 이벤트)
 socket.on('server2client', function(data){  
   //console.log('서버에서 전송:', data); 
  switch(data[0].Name){
    case "TOKENINFO":
      $('#L_NETID').html("<b>Chain ID:</b> "+data[1].NetID);
      $('#L_NAME').html( "<b>Name:</b> "+data[1].Name);
      $('#L_SYMBOL').html( "<b>Symbol:</b> "+data[1].Symbol);
      $('#L_DECIMALS').html( "<b>Decimals:</b> "+data[1].Decimals);
      $('#L_TOTAL').html( "<b>TotalSupply:</b> "+toCommas(data[1].TotalSupply));
      $('#L_STATUS').html( "<b>Token Status:</b> "+data[1].Status);
      $('#L_TOKEN_ADDR').html( "<b>Token Address:</b> "+data[1].TokenAddress);
      $('#L_TOKEN_OWNER').html( "<b>Token Owner:</b> "+data[1].TokenOwner); 
      break;
    case "SECRET-BALANCE":
      $('#ID-Balance_result').val(toCommas(data[1].value));
      $('#ID-Balance_msg').val(toCommas(data[1].msg));
      break;
    case "SECRET-WL-CHECK":
      $('#ID-WhiteList_result').val(data[1].value);
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
      $('#ID-TokenLock_result').val(data[1].value);
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
    case "SECRET-TOKEN-RESULT":
      if(data[1].value == 1) {
        var txt = `
        
        ---------------- Waiting Transaction!!!!! ---------------------`

      } else {
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

      $('#L_TXMSG').html(`Transaction message: <a href=https://ropsten.etherscan.io/tx/${data[1].msg.transactionHash} target="_blank">Goto Tx Page</a>`);
      }
      $('#ID-TxResult').val(txt);
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
 });

};

// client request command to server
function Send2Server(TYPE) {
  //alert(TYPE);
  switch(TYPE){
    case "NETWORK":
      socket.emit('client2server', {TYPE: "NETWORK", NETWORK: "RESERVED", TOKEN: "SECRET"});
      break;
    case "SECRET-BALANCE":
      TxtValue = $('#ID-Balance_address').val();
      socket.emit('client2server', {TYPE: "SECRET-BALANCE", ADDRESS: TxtValue});
      break;
    case "SECRET-TRANSFER":
      selectValue = $('#ID-txType').val();
      TxtFrom = $('#ID-tx_from').val();
      TxtTo = $('#ID-tx_to').val();
      TxtValue = $('#ID-tx_value').val();
      socket.emit('client2server', {TYPE: "SECRET-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
      break;
    case "SECRET-WL-CHECK":
    case "SECRET-WL-ADD":
    case "SECRET-WL-REMOVE":
    case "WHITELIST":
      selectValue = $('#ID-WhiteList').val();
      TxtValue = $('#ID-WhiteList_address').val();
      socket.emit('client2server', {TYPE: selectValue, ADDRESS: TxtValue});
    //alert(selectValue+", "+TxtValue);	
      break;
    case "SECRET-TOKEN-LOCK":
    case "SECRET-TOKEN-UNLOCK":
    case "SECRET-TOKEN-STATUS":
    case "TOKEN-STATUS":
      selectValue =$('#ID-TokenLock').val();
      socket.emit('client2server', {TYPE: selectValue});
      break;
    case "ETHER-BALANCE":
      TxtValue = $('#ID-ETHER_Balance_address').val();
      sendData = {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue};
      sendAjax(sendData, "POST");
      //socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
      break;
    case "ETHER-TRANSFER":
      selectValue = $('#ID-ETHER_txType').val();
      TxtFrom = $('#ID-ETHER_tx_from').val();
      TxtTo = $('#ID-ETHER_tx_to').val();
      TxtValue = $('#ID-ETHER_tx_value').val();
      socket.emit('client2server', {TYPE: "ETHER-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
      break;
    default:
      alert("Can not find your command", TYPE);
  }
}
*/
function Send2Server(TYPE) {
  //alert(TYPE);
  switch(TYPE){
    case "ETHER-BALANCE":
      TxtValue = $('#ID-ETHER_Balance_address').val();
      //sendData = {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue};
      url ="/secret/balance/"+TxtValue;
      sendData = `TYPE=ETHER-BALANCE&ADDRESS=${TxtValue}`;
      sendAjax_GET(url, sendData);
      //socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
      break;
  }
}

// function sendAjax(SendData, Method){
//   // str_data = JSON.stringify(SendData);
//   $.ajax({
//     url : "http://localhost:3000/token",
//     type: Method,
//     data: SendData,
//     success: function (return_data){
//       var result = JSON.parse(return_data);
//       // 데이터가 없으면 return 반환
//       alert("111: ", return_data);
//       alert("received: ", result[0].Name);
//       $('#ID-ETHER_Balance_result').val(result[1].Value);
//     },
//     error:function(jqXHR, textStatus, errorThrown){
//       alert("에러 발생~~ \n" + textStatus + " : " + errorThrown);
//     }
//   })
// }
  
  
function sendAjax_GET(SendData)  {
  console.log(SendData);
  url = `http://localhost:3000/token/${SendData}`;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Content-type', "application/json");
  xhr.send();


  xhr.addEventListener('load', function(){
    var result = JSON.parse(xhr.responseText);
    // console.log("===============================");
    // console.log("Received: ", xhr.responseText);
    // console.log("===============================");
    // console.log("Received2: ", result[0].Name);
    // console.log("Received3: ", result[1].value);
    // console.log("Received4: ", result[1].msg);
    switch(result[0].Name) {
      case "ETHER-BALANCE":
        $('#ID-ETHER_Balance_result').val(result[1].value);
        $('#ID-ETHER_Balance_msg').val(result[1].msg);
      break;
    }
  });

}

function sendAjax_POST(SendData){
  str_data = JSON.stringify(SendData);
  //alert("SEND-DATA: ", SendData);
  url = `http://localhost:3000/token/${str_data}`;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-type', "application/json");
  xhr.send(str_data);

  xhr.addEventListener('load', function(){
    var result = JSON.parse(xhr.responseText);
    // console.log("===============================");
    // console.log("Received: ", xhr.responseText);
    // console.log("===============================");
    // console.log("Received2: ", result[0].Name);
    // console.log("Received3: ", result[1].value);
    // console.log("Received4: ", result[1].msg);
    switch(result[0].Name) {
      case "ETHER-BALANCE":
        $('#ID-ETHER_Balance_result').val(result[1].value);
        $('#ID-ETHER_Balance_msg').val(result[1].msg);
      break;

    }
  });
}


// //var TSelect;
// //var selectValue;
// function SelectNetwork(){
// //	alert('1234');
// 	// TSelectNet = $('ID-Network');
//   // selectNet = TSelectNet.options[TSelectNet.selectedIndex].value;
// 	// TSelectToken = $('ID-Token');
//   // selectToken = TSelectToken.options[TSelectToken.selectedIndex].value;
//   socket.emit('client2server', {TYPE: "NETWORK", NETWORK: "ROPSTEN", TOKEN: "SECRET"});
// //  socket.emit('serverReceiver', {TYPE: "NETWORK", NETWORK: selectNet, TOKEN: selectToken});
// 	//alert(selectValue);
// }

// function SecretBalance() {
// //	alert('1234');
//   TxtValue = $('#ID-Balance_address').val();
//   socket.emit('client2server', {TYPE: "SECRET-BALANCE", ADDRESS: TxtValue});
// 	//alert(TxtValue);
// }

// function SecretWhiteList() {
// 	//alert('1234');
// 	selectValue = $('#ID-WhiteList').val();
//   TxtValue = $('#ID-WhiteList_address').val();
//   socket.emit('client2server', {TYPE: selectValue, ADDRESS: TxtValue});
//   //alert(selectValue+", "+TxtValue);	
// }
// function SecretSend() {
// 	selectValue = $('#ID-txType').val();
// 	TxtFrom = $('#ID-tx_from').val();
// 	TxtTo = $('#ID-tx_to').val();
//   TxtValue = $('#ID-tx_value').val();
//   socket.emit('client2server', {TYPE: "SECRET-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
// 	//alert(selectValue+", "+TxtFrom+", "+TxtTo+", "+TxtValue);	
// }
// function SecretTokenStatus(){
//   selectValue =$('#ID-TokenLock').val();
//   socket.emit('client2server', {TYPE: selectValue});
// 	//alert(selectValue);
// }
// function EtherBalance() {
//   //	alert('1234');
//     TxtValue = $('#ID-ETHER_Balance_address').val();
//     socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
//     //alert(TxtValue);
// }
// function EtherSend() {
// 	selectValue = $('#ID-ETHER_txType').val();
// 	TxtFrom = $('#ID-ETHER_tx_from').val();
// 	TxtTo = $('#ID-ETHER_tx_to').val();
//   TxtValue = $('#ID-ETHER_tx_value').val();
//   socket.emit('client2server', {TYPE: "ETHER-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
// 	//alert(selectValue+", "+TxtFrom+", "+TxtTo+", "+TxtValue);	
// }

// function DBList(){
//   socket.emit('client2server', 
//   { TYPE: "DB-LIST", 
//     QUERY: "select email, countryNum as RegCode, phoneNum, ethereumAddress, privateKey, sec_withdr_yn as lockYn, otpYn, regDate from t_user", 
//     PARAM: "limit 3"
//   });

// }

// utility
function toCommas(value) {
  //    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      var parts = value.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
}

