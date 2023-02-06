import algosdk from "algosdk";
import deployTokenTx from "../../txs/tokens/deployTokenTx";

interface IInput {
  client: algosdk.Algodv2;
  from: string;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;
}

const deployCreatePayload = async (inputData: IInput): Promise<string> => {
  const { client, from, signator, msigConfig } = inputData;
  const tx1 = await deployTokenTx({ client, deployerAddress: from });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default deployCreatePayload;
