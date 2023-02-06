import algosdk from "algosdk";
import createTestAssetTx from "../txs/createTestAssetTx";
const createTestAsset = async (client: algosdk.Algodv2, owner: algosdk.Account): Promise<number> => {
  let params = await client.getTransactionParams().do();
  const txn = createTestAssetTx(owner.addr, params);
  const signedTx = txn.signTxn(owner.sk);
  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      expect(e).toBeFalsy();
      console.log("e", e);
    });
  const response = await algosdk.waitForConfirmation(client, sendResult.txId, 4);
  const collateralAssetId = parseInt(response["asset-index"]);
  console.log(`Asset created`, collateralAssetId);
  return collateralAssetId;
};
export default createTestAsset;
