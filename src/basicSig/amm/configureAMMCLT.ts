import algosdk from "algosdk";
import configureAMMCLTTx from "../../txs/amm/configureAMMCLTTx";

interface InputObject {
  client: algosdk.Algodv2;
  sender: algosdk.Account;
  ammApp: number;
  assetA: number;
  assetB: number;
}
const configureAMMCLT = async (input: InputObject): Promise<number> => {
  const { client, sender, ammApp, assetA, assetB } = input;
  let params = await client.getTransactionParams().do();
  const txn = await configureAMMCLTTx({
    sender: sender.addr,
    params,
    ammApp,
    assetA,
    assetB,
  });
  const signedTx = txn.signTxn(sender.sk);
  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      console.log("e", e);
    });

  const response = await algosdk.waitForConfirmation(client, sendResult.txId, 4);
  //console.log("issue amm token: ", response);
  return parseInt(response["inner-txns"][0]["asset-index"]);
};
export default configureAMMCLT;
