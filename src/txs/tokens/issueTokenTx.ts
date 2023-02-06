import algosdk, { ABIContract, AtomicTransactionComposer, getMethodByName } from "algosdk";
import TokensJson from "../../../abi/stabilitas/Tokens.json";
const TokensABI = new ABIContract(TokensJson);
interface IParams {
  params: algosdk.SuggestedParams;
  sender: string;
  tokensAppId: number;
  name: string;
  unit: string;
  url: string;
  hash: Uint8Array;
  freeze: string;
  clawback: string;
}
/*
    name: abi.String, 
    unit: abi.String, 
    url: abi.String, 
    hash: abi.String,
    freeze: abi.Address,
    clawback: abi.Address,
*/
const issueTokenTx = (data: IParams): algosdk.Transaction => {
  const { sender, params, tokensAppId, name, unit, url, hash, freeze, clawback } = data;
  const signer = async () => [];
  //console.log("issueTokenTx", data);
  const atc = new AtomicTransactionComposer();
  atc.addMethodCall({
    sender,
    signer,
    appID: tokensAppId,
    method: getMethodByName(TokensABI.methods, "issueToken"),
    methodArgs: [name, unit, url, hash, freeze, clawback],
    suggestedParams: { ...params, flatFee: true, fee: 2000 },
  });
  const group = atc.buildGroup();
  const txs = group.map(({ txn }) => {
    txn.group = undefined;
    return txn;
  });
  return txs[0];
};
export default issueTokenTx;
