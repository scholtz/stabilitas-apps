import algosdk from "algosdk";

interface InputObject {
  oracleApp: number;
  priceFeedProviderAddress: string;
  asset: number;
  price: number;
  params: algosdk.SuggestedParams;
}
const setInitPriceTx = (input: InputObject): algosdk.Transaction => {
  const { oracleApp, priceFeedProviderAddress, asset, price, params } = input;
  const args: Uint8Array[] = [
    new Uint8Array(Buffer.from("a")),
    algosdk.bigIntToBytes(asset, 8),
    algosdk.bigIntToBytes(price, 8),
  ];

  return algosdk.makeApplicationCallTxnFromObject({
    appIndex: oracleApp,
    from: priceFeedProviderAddress,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    appArgs: args,
  });
};

export default setInitPriceTx;
