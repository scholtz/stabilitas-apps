import algosdk from "algosdk";

const createTestAssetTx = (creator: string, params: algosdk.SuggestedParams): algosdk.Transaction => {
  params.fee = 1000;
  return algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator,
    decimals: 6,
    defaultFrozen: false,
    suggestedParams: params,
    total: 10 ** 15,
    assetName: "USDC",
    manager: creator,
    unitName: "USDC",
  });
};
export default createTestAssetTx;
