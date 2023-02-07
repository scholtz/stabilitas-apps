import algosdk, { ABIContract, AtomicTransactionComposer, getMethodByName } from "algosdk";
import ReserveJson from "../../../abi/stabilitas/Reserve.json";
const ReserveABI = new ABIContract(ReserveJson);
interface IParams {
  params: algosdk.SuggestedParams;
  sender: string;
  reserveAppId: number;
  addrFee: string;
  addrLPFee: string;
  appAMM: number;
  appTokens: number;
  assetAMMLP: number;
  assetOracleBase: number;
  protocolFee: number;
  lpFee: number;
  negativeFee: number;
  exitFee: number;
  stopPriceTop: number;
  stopPriceLow: number;
}
/*
    addrFee: abi.Address , 
    addrLPFee: abi.Address , 
    addrTokensApp: abi.Address,
    appAMM: abi.Application,
    appTokens: abi.Application,
    assetAMMLP: abi.Asset,
    protocolFee: abi.Uint64, 
    lpFee: abi.Uint64, 
    negativeFee: abi.Uint64, 
    exitFee: abi.Uint64, 
    stopPriceTop: abi.Uint64, 
    stopPriceLow: abi.Uint64 , 
*/
const configureVariablesTx = (data: IParams): algosdk.Transaction => {
  const {
    sender,
    params,
    reserveAppId,
    addrFee,
    addrLPFee,
    appAMM,
    appTokens,
    assetAMMLP,
    assetOracleBase,
    protocolFee,
    lpFee,
    negativeFee,
    exitFee,
    stopPriceTop,
    stopPriceLow,
  } = data;
  const signer = async () => [];
  //console.log("configureVariablesTx", data);
  const addrTokensApp = algosdk.getApplicationAddress(appTokens);
  const atc = new AtomicTransactionComposer();
  atc.addMethodCall({
    sender,
    signer,
    appID: reserveAppId,
    method: getMethodByName(ReserveABI.methods, "configureVariables"),
    methodArgs: [
      addrFee,
      //addrLPFee,
      addrTokensApp,
      //appAMM,
      appTokens,
      //assetAMMLP,
      assetOracleBase,
      protocolFee,
      lpFee,
      negativeFee,
      exitFee,
      stopPriceTop,
      stopPriceLow,
    ],
    suggestedParams: { ...params, flatFee: true, fee: 3000 },
  });
  const group = atc.buildGroup();
  const txs = group.map(({ txn }) => {
    txn.group = undefined;
    return txn;
  });
  return txs[0];
};
export default configureVariablesTx;
