import algosdk, { ABIContract, AtomicTransactionComposer, getMethodByName } from "algosdk";
import TokensJson from "../../../abi/stabilitas/Tokens.json";
const TokensABI = new ABIContract(TokensJson);
interface IParams {
  params: algosdk.SuggestedParams;
  sender: string;
  tokensAppId: number;
  reserveAppId: number;
}
/*reserveApp: abi.Application
 */
const setReserveContractCreatePayloadTx = (data: IParams): algosdk.Transaction => {
  const { sender, params, tokensAppId, reserveAppId } = data;
  const signer = async () => [];
  //console.log("issueTokenTx", data);
  const atc = new AtomicTransactionComposer();
  atc.addMethodCall({
    sender,
    signer,
    appID: tokensAppId,
    method: getMethodByName(TokensABI.methods, "setReserveContract"),
    methodArgs: [reserveAppId],
    suggestedParams: { ...params, flatFee: true, fee: 1000 },
  });
  const group = atc.buildGroup();
  const txs = group.map(({ txn }) => {
    txn.group = undefined;
    return txn;
  });
  return txs[0];
};
export default setReserveContractCreatePayloadTx;
