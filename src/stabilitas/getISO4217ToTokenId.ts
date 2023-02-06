import algosdk from "algosdk";

interface IInput {
  indexer: algosdk.Indexer;
  tokensAppId: number;
}
interface ICurrency2Token {
  [currency: string]: number;
}
const getISO4217ToTokenId = async (inputData: IInput) => {
  const { indexer, tokensAppId } = inputData;
  const appState = await indexer.lookupApplications(tokensAppId).do();
  const ret: ICurrency2Token = {};
  //console.log("appState", appState.application.params["global-state"]);
  appState.application.params["global-state"].forEach((element) => {
    ret[Buffer.from(element.key, "base64").toString()] = element.value.uint;
  });
  //console.log("ret", ret);
  return ret;
};
export default getISO4217ToTokenId;
