// in html event

function MgmtMenu(ITEM){
// alert(ITEM+":111");
   switch(ITEM) {
    case "SECRET":
      $('#ID-DIV-SECRET').css("display", "block");
      $('#ID-DIV-ETHEREUM').css("display", "none");
      $('#ID-DIV-TOKENINFO').css("display", "none");
      $('#ID-DIV-TXRESULT').css("display", "block");
      $('#ID-TxResult').val("");
      break;
    case "Ethereum":
      $('#ID-DIV-SECRET').css("display", "none");
      $('#ID-DIV-ETHEREUM').css("display", "block");
      $('#ID-DIV-TOKENINFO').css("display", "none");
      $('#ID-DIV-TXRESULT').css("display", "block");
     $('#ID-TxResult').val("");
      break;
    case "TOKENINFO":
      $('#ID-DIV-SECRET').css("display", "none");
      $('#ID-DIV-ETHEREUM').css("display", "none");
      $('#ID-DIV-TOKENINFO').css("display", "block");
      $('#ID-DIV-TXRESULT').css("display", "none");
      Send2Server("NETWORK");
      break;
  };
  Send2Server("GET-TOKEN-HOLDER");

	// TSelectToken = document.getElementById('ID-Token');
  // selectToken = TSelectToken.options[TSelectToken.selectedIndex].value;
}

function Token_show_div(ITEM){
  //alert(ITEM+":222");
  $('#ID-SECRET-Balance').css("display", $('#SECRET-rBalance').is(":checked") ? "block" : "none" );
  $('#ID-SECRET-TokenTx').css("display", $('#SECRET-rTokenTx').is(":checked") ? "block" : "none" );
  $('#ID-SECRET-WhiteList').css("display", $('#SECRET-rWhitelist').is(":checked") ? "block" : "none" );
  $('#ID-SECRET-TokenLock').css("display", $('#SECRET-rTokenLock').is(":checked") ? "block" : "none" );

}


function ETHER_show_div(ITEM){
  //alert(ITEM+":333");
  $('#ID-ETHER-Balance').css("display", $('#ETHER-rBalance').is(":checked") ? "block" : "none" );
  $('#ID-ETHER-TokenTx').css("display", $('#ETHER-rTokenTx').is(":checked") ? "block" : "none" );
  
  // if($('#ETHER-rBalance').is(":checked") == true){
  //   alert("get Token Holder info for Balance");
  // }
  // if($('#ETHER-rTokenTx').is(":checked") == true){
  //   alert("get Token Holder info for Tx");
  // }
}

