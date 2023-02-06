import algosdk from "algosdk";
import setReserveContractCreatePayloadTx from "../../txs/tokens/setReserveContractCreatePayloadTx";

interface IInput {
  client: algosdk.Algodv2;
  from: string;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;
  tokensAppId: number;
  reserveAppId: number;
}

const setReserveContractCreatePayload = async (inputData: IInput): Promise<string> => {
  const { client, from, signator, msigConfig, reserveAppId, tokensAppId } = inputData;
  let params = await client.getTransactionParams().do();
  const tx1 = await setReserveContractCreatePayloadTx({ params, sender: from, tokensAppId, reserveAppId });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default setReserveContractCreatePayload;
