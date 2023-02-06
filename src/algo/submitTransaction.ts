import algosdk from "algosdk";

async function submitTransaction(algodClient: algosdk.Algodv2, signedTxn: Uint8Array) {
  const { txId } = await algodClient
    .sendRawTransaction(signedTxn)
    .do()
    .catch((e) => {
      console.error("error submitTransaction", e.response.body);
      //console.log("error compiling", Buffer.from(e.response._data).toString("utf-8"));
    });
  const response = await algosdk.waitForConfirmation(algodClient, txId, 4);
  return { txId, response };
}
export default submitTransaction;
