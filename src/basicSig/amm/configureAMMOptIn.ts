import algosdk from "algosdk";
import configureAMMOptInTx from "../../txs/amm/configureAMMOptInTx";

interface InputObject {
  client: algosdk.Algodv2;
  sender: algosdk.Account;
  ammApp: number;
  assetA: number;
  assetB: number;
}
const configureAMMOptIn = async (input: InputObject): Promise<number> => {
  const { client, sender, ammApp, assetA, assetB } = input;
  let params = await client.getTransactionParams().do();
  const txn = await configureAMMOptInTx({
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
      expect(e).toBeFalsy();
      console.log("e", e);
    });

  const response = await algosdk.waitForConfirmation(client, sendResult.txId, 4);
  console.log("amm optin: ", response);
  return 0;
  //return parseInt(response["application-index"]);
};
export default configureAMMOptIn;
