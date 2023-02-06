import algosdk from "algosdk";

interface InputObject {
  ammApp: number;
  sender: string;
  params: algosdk.SuggestedParams;
  assetA: number;
  assetB: number;
}
const configureAMMCLTTx = (input: InputObject): algosdk.Transaction => {
  const { ammApp, sender, params, assetA, assetB } = input;
  const args: Uint8Array[] = [new Uint8Array(Buffer.from("CLT"))];
  return algosdk.makeApplicationCallTxnFromObject({
    appIndex: ammApp,
    from: sender,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: { ...params, fee: 2000, flatFee: true },
    appArgs: args,
    foreignAssets: [assetA, assetB],
  });
};

export default configureAMMCLTTx;
