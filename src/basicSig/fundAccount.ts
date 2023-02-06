import algosdk from "algosdk";
interface IInput {
  client: algosdk.Algodv2;
  sender: algosdk.Account;
  receiver: string;
  amount: number;
}

const fundAccount = async (inputData: IInput) => {
  const { client, sender, receiver, amount } = inputData;
  let params = await client.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    amount: amount,
    from: sender.addr,
    to: receiver,
    suggestedParams: params,
  });
  const signedTx = txn.signTxn(sender.sk);
  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      console.log("e", e);
    });
  console.log(`account ${receiver} funded`, sendResult);
};

export default fundAccount;
