import algosdk, { ABIContract, AtomicTransactionComposer, getMethodByName } from "algosdk";
import ReserveJson from "../../../abi/stabilitas/Reserve.json";
const ReserveABI = new ABIContract(ReserveJson);
interface IParams {
  params: algosdk.SuggestedParams;
  sender: string;
  reserveAppId: number;

  oracleECB: number;
  oracleAMMVWAP1W: number;
  oracleAMMVWAP1H: number;

  oracleECBWeight: number;
  oracleAMMVWAP1WWeight: number;
  oracleAMMVWAP1HWeight: number;

  assetOracleBase: number;
}
/*
    o1: abi.Application, 
    o1w: abi.Uint64, 
    o2: abi.Application, 
    o2w: abi.Uint64, 
    o3: abi.Application, 
    o3w: abi.Uint64, 
    assetOracleBase: abi.Asset,
*/
const configureOraclesTx = (data: IParams): algosdk.Transaction => {
  const {
    sender,
    params,
    reserveAppId,
    oracleECB,
    oracleAMMVWAP1W,
    oracleAMMVWAP1H,
    oracleECBWeight,
    oracleAMMVWAP1WWeight,
    oracleAMMVWAP1HWeight,
    assetOracleBase,
  } = data;
  const signer = async () => [];
  console.log("configureOraclesTx", data);
  const atc = new AtomicTransactionComposer();
  atc.addMethodCall({
    sender,
    signer,
    appID: reserveAppId,
    method: getMethodByName(ReserveABI.methods, "configureOracles"),
    methodArgs: [
      oracleECB,
      oracleECBWeight,
      oracleAMMVWAP1W,
      oracleAMMVWAP1WWeight,
      oracleAMMVWAP1H,
      oracleAMMVWAP1HWeight,
      assetOracleBase,
    ],
    suggestedParams: { ...params, flatFee: true, fee: 2000 },
  });
  const group = atc.buildGroup();
  const txs = group.map(({ txn }) => {
    txn.group = undefined;
    return txn;
  });
  return txs[0];
};
export default configureOraclesTx;
