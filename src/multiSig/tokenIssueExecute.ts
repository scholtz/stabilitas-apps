import algosdk from "algosdk";

interface IInput {
  client: algosdk.Algodv2;
  payload: string;
}
const tokenIssueExecute = async (inputData: IInput) => {
  const { client, payload } = inputData;
  const txBytes = new Uint8Array(Buffer.from(payload, "base64url"));
  const sendResult = await client
    .sendRawTransaction(txBytes)
    .do()
    .catch((e) => {
      console.error("e", e);
    });

  const response = await algosdk.waitForConfirmation(client, sendResult.txId, 4);
  //console.log("response", response);
  return parseInt(response["inner-txns"][0]["asset-index"]);
};
export default tokenIssueExecute;
