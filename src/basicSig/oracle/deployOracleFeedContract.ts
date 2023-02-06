import algosdk from "algosdk";
import deployOracleTx from "../../txs/oracle/deployOracleTx";

interface InputObject {
  client: algosdk.Algodv2;
  deployerAccount: algosdk.Account;
  priceProviderAccount: string;
}
const deployOracleFeedContract = async (input: InputObject): Promise<number> => {
  const { client, deployerAccount, priceProviderAccount } = input;
  const txn = await deployOracleTx({
    deployerAddress: deployerAccount.addr,
    priceProviderAddress: priceProviderAccount,
    client,
  });
  const signedTx = txn.signTxn(deployerAccount.sk);
  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      expect(e).toBeFalsy();
      console.log("e", e);
    });

  const response = await algosdk.waitForConfirmation(client, sendResult.txId, 4);
  return parseInt(response["application-index"]);
};
export default deployOracleFeedContract;
