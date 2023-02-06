import algosdk from "algosdk";
import configureVariablesTx from "../../txs/reserve/configureVariablesTx";

interface IInput {
  client: algosdk.Algodv2;
  from: string;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;

  reserveAppId: number;
  addrFee: string;
  addrLPFee: string;
  appAMM: number;
  appTokens: number;
  assetAMMLP: number;
  assetOracleBase: number;
  protocolFee: number;
  lpFee: number;
  negativeFee: number;
  exitFee: number;
  stopPriceTop: number;
  stopPriceLow: number;
}

const configureVariablesCreatePayload = async (inputData: IInput): Promise<string> => {
  const {
    client,
    from,
    signator,
    msigConfig,
    reserveAppId,
    addrFee,
    addrLPFee,
    appAMM,
    appTokens,
    assetAMMLP,
    assetOracleBase,
    protocolFee,
    lpFee,
    negativeFee,
    exitFee,
    stopPriceTop,
    stopPriceLow,
  } = inputData;
  let params = await client.getTransactionParams().do();
  const tx1 = configureVariablesTx({
    params,
    sender: from,
    reserveAppId,
    addrFee,
    addrLPFee,
    appAMM,
    appTokens,
    assetAMMLP,
    assetOracleBase,
    protocolFee,
    lpFee,
    negativeFee,
    exitFee,
    stopPriceTop,
    stopPriceLow,
  });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default configureVariablesCreatePayload;
