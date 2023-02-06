import algosdk, { makeApplicationCallTxnFromObject } from "algosdk";
import IPricePair from "../../interface/IPricePair";
import updatePriceTx from "../../txs/oracle/updatePriceTx";

interface IInput {
  client: algosdk.Algodv2;
  from: string;
  prices: IPricePair[];
  oracleFeedAppId: number;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;
}

const updateOraclePriceCreatePayload = async (inputData: IInput): Promise<string> => {
  const { client, from, prices, oracleFeedAppId, signator, msigConfig } = inputData;
  let params = await client.getTransactionParams().do();
  const tx1 = updatePriceTx({ from, oracleFeedAppId, params, prices });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default updateOraclePriceCreatePayload;
