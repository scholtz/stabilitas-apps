import algosdk from "algosdk";
const optInToAsa = async (client: algosdk.Algodv2, sender: algosdk.Account, assetId: number) => {
  let params = await client.getTransactionParams().do();
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    amount: 0,
    from: sender.addr,
    to: sender.addr,
    assetIndex: assetId,
    suggestedParams: params,
  });
  const signedTx = txn.signTxn(sender.sk);
  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      if (e && e.message) console.error("e.message", e.message);
      expect(e).toBeFalsy();
    });
  console.log(`account ${sender.addr} opted in to asset ${assetId}`, sendResult);
};

export default optInToAsa;
