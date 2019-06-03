var socket;
window.onload = function(){ 
 //클라이언트 소켓 생성
 socket = io.connect('ws://127.0.0.1:3000');

 //클라이언트 receive 이벤트 함수(서버에서 호출할 이벤트)
 socket.on('server2client', function(data){  
   //console.log('서버에서 전송:', data); 
  switch(data[0].Name){
    case "TOKENINFO":
      document.getElementById('L_NETID').innerHTML        = "<b>Chain ID:</b> "+data[1].NetID;
      document.getElementById('L_NAME').innerHTML         = "<b>Name:</b> "+data[1].Name;
      document.getElementById('L_SYMBOL').innerHTML       = "<b>Symbol:</b> "+data[1].Symbol;
      document.getElementById('L_DECIMALS').innerHTML     = "<b>Decimals:</b> "+data[1].Decimals;
      document.getElementById('L_TOTAL').innerHTML        = "<b>TotalSupply:</b> "+toCommas(data[1].TotalSupply);
      document.getElementById('L_STATUS').innerHTML       = "<b>Token Status:</b> "+data[1].Status;
      document.getElementById('L_TOKEN_ADDR').innerHTML   = "<b>Token Address:</b> "+data[1].TokenAddress;
      document.getElementById('L_TOKEN_OWNER').innerHTML  = "<b>Token Owner:</b> "+data[1].TokenOwner; 
      break;
    case "SECRET-BALANCE":
      document.getElementById('ID-Balance_result').value = toCommas(data[1].value);
      document.getElementById('ID-Balance_msg').value = toCommas(data[1].msg);
      break;
    case "SECRET-WL-CHECK":
      document.getElementById('ID-WhiteList_result').value = data[1].value;
      document.getElementById('ID-WhiteList_msg').value = data[1].msg;
      break;
    case "SECRET-WL-ADD":
      document.getElementById('ID-WhiteList_result').value = data[1].value;
      document.getElementById('ID-WhiteList_msg').value = data[1].msg;
      break;
    case "SECRET-WL-REMOVE":
      document.getElementById('ID-WhiteList_result').value = data[1].value;
      document.getElementById('ID-WhiteList_msg').value = data[1].msg;
      break;
    case "SECRET-TOKEN-STATUS":
      document.getElementById('ID-TokenLock_result').value = data[1].value;
      document.getElementById('ID-TokenLock_msg').value = data[1].msg;
      break;
    case "SECRET-TOKEN-LOCK":
      document.getElementById('ID-TokenLock_result').value = data[1].value;
      document.getElementById('ID-TokenLock_msg').value = data[1].msg;
      break;
    case "SECRET-TOKEN-UNLOCK":
      document.getElementById('ID-TokenLock_result').value = data[1].value;
      document.getElementById('ID-TokenLock_msg').value = data[1].msg;
      break;
    case "SECRET-TRANSFER":
      document.getElementById('ID-tx_result').value = data[1].value;
      document.getElementById('ID-tx_msg').value = data[1].msg;
      break;
    case "ETHER-BALANCE":
      document.getElementById('ID-ETHER_Balance_result').value = toCommas(data[1].value);
      document.getElementById('ID-ETHER_Balance_msg').value = toCommas(data[1].msg);
      break;
    case "ETHER-TRANSFER":
      document.getElementById('ID-ETHER_tx_result').value = data[1].value;
      document.getElementById('ID-ETHER_tx_msg').value = data[1].msg;
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

      document.getElementById('L_TXMSG').innerHTML = `Transaction message: <a href=https://ropsten.etherscan.io/tx/${data[1].msg.transactionHash} target="_blank">Goto Tx Page</a>`;
      }
      document.getElementById('ID-TxResult').value = txt;
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
      document.getElementById('ID-DATAResult').innerHTML = txt;
      break;

    default:
      alert("Invalid name: "+data[0].Name);
      break;
  }   
 });
};

//    //소켓서버 함수 호출  
//    socket.emit('serverReceiver', message);

//var TSelect;
//var selectValue;
function SelectNetwork(){
//	alert('1234');
	// TSelectNet = document.getElementById('ID-Network');
  // selectNet = TSelectNet.options[TSelectNet.selectedIndex].value;
	// TSelectToken = document.getElementById('ID-Token');
  // selectToken = TSelectToken.options[TSelectToken.selectedIndex].value;
  socket.emit('client2server', {TYPE: "NETWORK", NETWORK: "ROPSTEN", TOKEN: "SECRET"});
//  socket.emit('serverReceiver', {TYPE: "NETWORK", NETWORK: selectNet, TOKEN: selectToken});
	//alert(selectValue);
}

function SecretBalance() {
//	alert('1234');
  TxtValue = document.getElementById('ID-Balance_address').value;
  socket.emit('client2server', {TYPE: "SECRET-BALANCE", ADDRESS: TxtValue});
	//alert(TxtValue);
}

function SecretWhiteList() {
	//alert('1234');
	TSelect = document.getElementById('ID-WhiteList');
	selectValue = TSelect.options[TSelect.selectedIndex].value;
  TxtValue = document.getElementById('ID-WhiteList_address').value;
  socket.emit('client2server', {TYPE: selectValue, ADDRESS: TxtValue});
  //alert(selectValue+", "+TxtValue);	
}
function SecretSend() {
	TSelect = document.getElementById('ID-txType');
	selectValue = TSelect.options[TSelect.selectedIndex].value;
	TxtFrom = document.getElementById('ID-tx_from').value;
	TxtTo = document.getElementById('ID-tx_to').value;
  TxtValue = document.getElementById('ID-tx_value').value;
  socket.emit('client2server', {TYPE: "SECRET-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
	//alert(selectValue+", "+TxtFrom+", "+TxtTo+", "+TxtValue);	
}
function SecretTokenStatus(){
	TSelect = document.getElementById('ID-TokenLock');
  selectValue = TSelect.options[TSelect.selectedIndex].value;
  socket.emit('client2server', {TYPE: selectValue});
	//alert(selectValue);
}
function EtherBalance() {
  //	alert('1234');
    TxtValue = document.getElementById('ID-ETHER_Balance_address').value;
    socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
    //alert(TxtValue);
}
function EtherSend() {
	TSelect = document.getElementById('ID-ETHER_txType');
	selectValue = TSelect.options[TSelect.selectedIndex].value;
	TxtFrom = document.getElementById('ID-ETHER_tx_from').value;
	TxtTo = document.getElementById('ID-ETHER_tx_to').value;
  TxtValue = document.getElementById('ID-ETHER_tx_value').value;
  socket.emit('client2server', {TYPE: "ETHER-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
	//alert(selectValue+", "+TxtFrom+", "+TxtTo+", "+TxtValue);	
}

function DBList(){
  socket.emit('client2server', 
  { TYPE: "DB-LIST", 
    QUERY: "select email, countryNum as RegCode, phoneNum, ethereumAddress, privateKey, sec_withdr_yn as lockYn, otpYn, regDate from t_user", 
    PARAM: "limit 3"
  });

}

// utility
function toCommas(value) {
  //    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      var parts = value.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
}

