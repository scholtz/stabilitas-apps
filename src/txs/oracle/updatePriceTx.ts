import algosdk, { makeApplicationCallTxnFromObject } from "algosdk";
import IPricePair from "../../interface/IPricePair";

interface IInput {
  params: algosdk.SuggestedParams;
  from: string;
  prices: IPricePair[];
  oracleFeedAppId: number;
}

const updatePriceTx = (inputData: IInput): algosdk.Transaction => {
  const { params, from, prices, oracleFeedAppId } = inputData;

  let data = new Uint8Array();
  // TODO .. increase limit 10 to higher number by adding more txs to the group to increase opcode costs
  for (var price of prices.slice(0, 10)) {
    data = new Uint8Array([
      ...data,
      ...algosdk.bigIntToBytes(price.asset, 8),
      ...algosdk.bigIntToBytes(price.price, 8),
    ]);
  }
  const args: Uint8Array[] = [new Uint8Array(Buffer.from("u")), data];
  console.log("price update args");
  args.forEach((element) => {
    console.log(Buffer.from(element).toString("hex"));
  });
  return makeApplicationCallTxnFromObject({
    appIndex: oracleFeedAppId,
    from,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    appArgs: args,
  });
};
export default updatePriceTx;
