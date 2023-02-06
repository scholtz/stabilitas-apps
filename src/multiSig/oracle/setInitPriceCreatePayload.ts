import algosdk from "algosdk";
import setInitPriceTx from "../../txs/oracle/setInitPriceTx";

interface IInput {
  client: algosdk.Algodv2;
  from: string;
  asset: number;
  price: number;
  oracleFeedAppId: number;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;
}

const setInitPriceCreatePayload = async (inputData: IInput): Promise<string> => {
  const { client, from, asset, price, oracleFeedAppId, signator, msigConfig } = inputData;
  let params = await client.getTransactionParams().do();
  const tx1 = setInitPriceTx({ asset, oracleApp: oracleFeedAppId, params, price, priceFeedProviderAddress: from });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default setInitPriceCreatePayload;
