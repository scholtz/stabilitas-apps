import algosdk from "algosdk";
import setInitPriceTx from "../../txs/oracle/setInitPriceTx";

interface InputObject {
  client: algosdk.Algodv2;
  oracleApp: number;
  priceFeedProviderAccount: algosdk.Account;
  asset: number;
  price: number;
}

const setInitPrice = async (input: InputObject) => {
  const { client, oracleApp, priceFeedProviderAccount, asset, price } = input;
  //const asset1 = 0; // algo
  //const price1 = 32_186_692; // 1

  let params = await client.getTransactionParams().do();
  const txn = setInitPriceTx({
    asset,
    oracleApp,
    params,
    price,
    priceFeedProviderAddress: priceFeedProviderAccount.addr,
  });
  const signedTx = txn.signTxn(priceFeedProviderAccount.sk);

  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      expect(e).toBeFalsy();
      console.log("e", e);
    });
  return sendResult.txId;
};

export default setInitPrice;
