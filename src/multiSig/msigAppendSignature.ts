import algosdk, { makeApplicationCallTxnFromObject } from "algosdk";
import IPricePair from "../interface/IPricePair";
import updatePriceTx from "../txs/oracle/updatePriceTx";

interface IInput {
  payload: string;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;
}

const msigAppendSignature = (inputData: IInput): string => {
  const { payload, signator, msigConfig } = inputData;
  const txBytes = new Uint8Array(Buffer.from(payload, "base64url"));
  //var txDecoded = algosdk.decodeSignedTransaction(txBytes);
  let rawSignedTxn = algosdk.appendSignMultisigTransaction(txBytes, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default msigAppendSignature;
