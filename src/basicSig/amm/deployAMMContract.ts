import algosdk from "algosdk";
import deployAMMTx from "../../txs/amm/deployAMMTx";

interface InputObject {
  client: algosdk.Algodv2;
  deployerAccount: algosdk.Account;
  assetA: number;
  assetB: number;
}
const deployAMMContract = async (input: InputObject): Promise<number> => {
  const { client, deployerAccount, assetA, assetB } = input;
  const txn = await deployAMMTx({
    deployerAddress: deployerAccount.addr,
    client,
    assetA,
    assetB,
  });
  const signedTx = txn.signTxn(deployerAccount.sk);
  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      console.log("e", e);
    });

  const response = await algosdk.waitForConfirmation(client, sendResult.txId, 4);
  return parseInt(response["application-index"]);
};
export default deployAMMContract;
