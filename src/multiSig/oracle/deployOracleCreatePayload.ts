import algosdk from "algosdk";
import deployOracleTx from "../../txs/oracle/deployOracleTx";

interface IInput {
  client: algosdk.Algodv2;
  deployerAddress: string;
  priceProviderAddress: string;
  signator: algosdk.Account;
  msigConfig: algosdk.MultisigMetadata;
}

const deployOracleCreatePayload = async (inputData: IInput): Promise<string> => {
  const { client, deployerAddress, priceProviderAddress, signator, msigConfig } = inputData;
  const tx1 = await deployOracleTx({ client, deployerAddress, priceProviderAddress });
  let rawSignedTxn = algosdk.signMultisigTransaction(tx1, msigConfig, signator.sk).blob;
  return Buffer.from(rawSignedTxn).toString("base64url");
};
export default deployOracleCreatePayload;
