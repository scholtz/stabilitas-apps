import algosdk from "algosdk";

interface InputObject {
  ammApp: number;
  sender: string;
  params: algosdk.SuggestedParams;
  assetA: number;
  assetB: number;
}
const configureAMMCTLTx = (input: InputObject): algosdk.Transaction => {
  const { ammApp, sender, params, assetA, assetB } = input;
  const args: Uint8Array[] = [new Uint8Array(Buffer.from("OPTIN"))];
  return algosdk.makeApplicationCallTxnFromObject({
    appIndex: ammApp,
    from: sender,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: { ...params, fee: 3000, flatFee: true },
    appArgs: args,
    foreignAssets: [assetA, assetB],
  });
};

export default configureAMMCTLTx;
