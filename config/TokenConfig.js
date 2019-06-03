// config/TokenConfig.js
module.exports = {

//var CHAIN_ID;
/* Private network */
// CToken_Owner_Address      : "0x32d07dca0adcd77d52598c2221bb65241b0ecbda",                             //localhost 
// CToken_Owner_PrivateKey   : "C2D2B01A7AC0AA5CC886B36088AB80D6EC6646E088B24AE9AC1EDFA189DD0FE3",       // localhost  for 0x32d0...
// CToken_Address            : "0x46f94d22dddd2d73e64e44a7684c40c98cb7f4c7",                             //localhost  TM for EOA: 0x32d0...
// PROVIDER_URL              : "http://localhost:8545",                                                  //localhost 600600
// CHAIN_ID                  : 600600

/* Test network: Ropsten */
CToken_Owner_Address        : "0x1986652c679bcba5f716d9d1f9fad88d23a0cbc1",                             //ropsten.testnet lastest
CToken_Owner_PrivateKey     : "BCF4E4D127886293ADBFD7F16F5655ECB725DAF3BD78197BA7182802FC449EF5",       //ropsten.testnet for 0x1986652...
CToken_Address              : "0x764Ed0F333E75beDB471700bdC5ebc8764a4089b",                             //ropsten.testnet TM for EOA: 0x19866...
//PROVIDER_URL              : "http://192.168.2.14:8545",                                               //ropsten.testnet
PROVIDER_URL                : "https://ropsten.infura.io/v3/8831d56e946146a5bf2d5df68f034ee3",          //ropsten.testnet
CHAIN_ID                    : 3


/* Main network: Ethereum */
// CToken_Owner_Address      : "0x59E30CBe22f6611cDBF7620a68d3B018522313e1",                             // mainnet TM account
// CToken_Owner_PrivateKey   : "BEDFEC3C81C0DC1E1506389A0CB1AF43E7E5C86BA3F9065ED96B69BCB9F85F78",       // mainnet TM account 0x59E30CBe22f6611cDBF7620a68d3B018522313e1
// CToken_Address            : "0xfe3Bc42EE764Ac624C46c6e5b1707fa778223ce9",                             //mainnet TM token address
// PROVIDER_URL              : "http://192.168.2.15:8545",                                               //mainnet
// //PROVIDER_URL              : "https://mainnet.infura.io/v3/8831d56e946146a5bf2d5df68f034ee3",          //mainnet
// CHAIN_ID                  : 1

//PROVIDER_URL = "https://kovan.infura.io/v3/8831d56e946146a5bf2d5df68f034ee3";
//PROVIDER_URL = "https://rinkeby.infura.io/v3/8831d56e946146a5bf2d5df68f034ee3";
//PROVIDER_URL = "https://goerli.infura.io/v3/8831d56e946146a5bf2d5df68f034ee3";
//CToken_Owner_Address = "0xa635ea034E5E64181914c2B5d403C0b4c11ac26D";  //ropsten.testnet
//CToken_Owner_Address = "0xA1f5C0D3BABF3D54950d43EBD0d59Bc7824C7B1A";  //ropsten.testnet
//PROVIDER_URL = "https://mainnet.infura.io/v3/8831d56e946146a5bf2d5df68f034ee3";   //mainnet

};