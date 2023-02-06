import algosdk from "algosdk";
interface IInput {
  client: algosdk.Algodv2;
  sender: algosdk.Account;
  app: number;
}

const rekeyToApp = async (inputData: IInput) => {
  const { client, sender, app } = inputData;
  let params = await client.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    amount: 0,
    from: sender.addr,
    to: sender.addr,
    rekeyTo: algosdk.getApplicationAddress(app),
    suggestedParams: params,
  });
  const signedTx = txn.signTxn(sender.sk);
  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      console.log("e", e);
    });
  console.log(`rekeyed to ${app} ${algosdk.getApplicationAddress(app)}`, sendResult);
};

export default rekeyToApp;
