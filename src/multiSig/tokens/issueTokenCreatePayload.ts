import algosdk from "algosdk";
import issueTokenTx from "../../txs/tokens/issueTokenTx";

interface IInput {
  client: algosdk.Algodv2;
  from: string;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;
  tokensAppId: number;
  name: string;
  unit: string;
  url: string;
  hash: Uint8Array;
  freeze: string;
  clawback: string;
}

const issueTokenCreatePayload = async (inputData: IInput): Promise<string> => {
  const { client, from, signator, msigConfig, clawback, freeze, hash, name, tokensAppId, unit, url } = inputData;
  let params = await client.getTransactionParams().do();
  const tx1 = await issueTokenTx({ params, clawback, freeze, hash, name, sender: from, tokensAppId, unit, url });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default issueTokenCreatePayload;
