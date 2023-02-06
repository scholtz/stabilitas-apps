import algosdk from "algosdk";

interface IInput {
  client: algosdk.Algodv2;
  payload: string;
}
const msigSubmit = async (inputData: IInput) => {
  const { client, payload } = inputData;
  const txBytes = new Uint8Array(Buffer.from(payload, "base64url"));
  const sendResult = await client
    .sendRawTransaction(txBytes)
    .do()
    .catch((e) => {
      console.error("e", e);
    });
  return sendResult.txId;
};
export default msigSubmit;
