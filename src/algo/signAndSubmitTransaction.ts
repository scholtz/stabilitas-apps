//
// Signs and submits a transaction, then waits for confirmation.

import algosdk from "algosdk";
import submitTransaction from "./submitTransaction";

//
export async function signAndSubmitTransaction(
  algodClient: algosdk.Algodv2,
  fromAccount: algosdk.Account,
  txn: algosdk.Transaction
) {
  const result = await submitTransaction(algodClient, txn.signTxn(fromAccount.sk));
  return {
    txnId: result.txId,
    confirmedRound: result.response["confirmed-round"],
    response: result.response,
  };
}
export default signAndSubmitTransaction;
