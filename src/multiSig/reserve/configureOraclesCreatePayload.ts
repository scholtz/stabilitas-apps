import algosdk from "algosdk";
import configureOraclesTx from "../../txs/reserve/configureOraclesTx";

interface IInput {
  client: algosdk.Algodv2;
  from: string;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;

  reserveAppId: number;
  oracleECB: number;
  oracleAMMVWAP1W: number;
  oracleAMMVWAP1H: number;

  oracleECBWeight: number;
  oracleAMMVWAP1WWeight: number;
  oracleAMMVWAP1HWeight: number;

  assetOracleBase: number;
}

const configureOraclesCreatePayload = async (inputData: IInput): Promise<string> => {
  const {
    client,
    from,
    signator,
    msigConfig,
    reserveAppId,
    oracleECB,
    oracleAMMVWAP1W,
    oracleAMMVWAP1H,
    oracleECBWeight,
    oracleAMMVWAP1WWeight,
    oracleAMMVWAP1HWeight,
    assetOracleBase,
  } = inputData;
  let params = await client.getTransactionParams().do();
  const tx1 = configureOraclesTx({
    params,
    sender: from,
    reserveAppId,
    oracleECB,
    oracleAMMVWAP1W,
    oracleAMMVWAP1H,
    oracleECBWeight,
    oracleAMMVWAP1WWeight,
    oracleAMMVWAP1HWeight,
    assetOracleBase,
  });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default configureOraclesCreatePayload;
