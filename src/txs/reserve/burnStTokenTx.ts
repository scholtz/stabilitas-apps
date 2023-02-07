import algosdk, { ABIContract, AtomicTransactionComposer, getMethodByName } from "algosdk";
import ReserveJson from "../../../abi/stabilitas/Reserve.json";
const ReserveABI = new ABIContract(ReserveJson);
interface IParams {
  params: algosdk.SuggestedParams;
  sender: string;
  reserveAppId: number;
  addrFee: string;
  oracleECB: number;
  oracleAMM1W: number;
  oracleAMM1H: number;
  tokensApp: number;
  depositAsset: number;
  claimAsset: number;
  depositAmount: number;
  minimumToReceive: number;
}
/*
    depositToReserve: abi.Transaction, 
    #lpHolderAccount: abi.Address,
    oracleECB: abi.Application, 
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
    tokensApp: abi.Application, 
    #appAMM: abi.Application,
    depositAsset: abi.Asset, 
    claimAsset: abi.Asset, 
    #assetAMMLP: abi.Asset,
    depositAmount: abi.Uint64, 
    minimumToReceive: abi.Uint64 
*/
const burnStTokenTx = (data: IParams): algosdk.Transaction[] => {
  const {
    sender,
    params,
    reserveAppId,
    addrFee,
    oracleECB,
    oracleAMM1W,
    oracleAMM1H,
    tokensApp,
    depositAsset,
    claimAsset,
    depositAmount,
    minimumToReceive,
  } = data;
  const signer = async () => [];
  //console.log("burnStTokenTx", data);

  const deposit = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    amount: depositAmount,
    assetIndex: depositAsset,
    from: sender,
    suggestedParams: params,
    to: algosdk.getApplicationAddress(tokensApp),
  });

  // depositToReserve: abi.Transaction,
  // addrFee: abi.Account,
  // oracleECB: abi.Application,
  // oracleAMM1W: abi.Application,
  // oracleAMM1H: abi.Application,
  // stAsset: abi.Asset,
  // claimAsset: abi.Asset,
  // depositStTokenAmount: abi.Uint64,
  // minimumToReceive: abi.Uint64
  const atc = new AtomicTransactionComposer();
  atc.addMethodCall({
    sender,
    signer,
    appID: reserveAppId,
    method: getMethodByName(ReserveABI.methods, "burnStToken"),
    methodArgs: [
      { txn: deposit, signer },
      addrFee,
      oracleECB,
      oracleAMM1W,
      oracleAMM1H,
      depositAsset,
      claimAsset,
      depositAmount,
      minimumToReceive,
    ],
    suggestedParams: { ...params, flatFee: true, fee: 4000 },
  });
  const group = atc.buildGroup();
  const txs = group.map(({ txn }) => {
    txn.group = undefined;
    return txn;
  });
  return algosdk.assignGroupID(txs);
};
export default burnStTokenTx;
