import algosdk from "algosdk";
import * as fs from "fs";
import compileProgram from "../../algo/compileProgram";

interface InputObject {
  deployerAddress: string;
  priceProviderAddress: string;
  client: algosdk.Algodv2;
}
const deployOracleTx = async (input: InputObject) => {
  const { deployerAddress, priceProviderAddress, client } = input;
  let approvalProgramTeal = fs.readFileSync("onchain/contracts/oracle/folks-finance-oracle-updater.teal", {
    encoding: "utf8",
  });
  const clearProgramTeal = fs.readFileSync("onchain/contracts/oracle/folks-finance-clear.teal", { encoding: "utf8" });
  const fee = 1000;
  const numGlobalByteSlices = 64;
  const numGlobalInts = 0;
  const numLocalByteSlices = 0;
  const numLocalInts = 0;
  const appArgs: Uint8Array[] = [];
  const accounts: string[] = [priceProviderAddress];
  const decoded = algosdk.decodeAddress(deployerAddress);
  const hex = "0x" + Buffer.from(decoded.publicKey).toString("hex");
  approvalProgramTeal = approvalProgramTeal.replace(
    "0x0d42527e870f471dfe2e6c70f3b3831062aed355288edea2133bdf1ceca1e072",
    hex
  );
  if (!approvalProgramTeal.indexOf(hex)) {
    throw new Error("Failed to hardcode creator address");
  }

  const params = await client.getTransactionParams().do();
  const compileApprovalProgram = await compileProgram(client, approvalProgramTeal);
  const compileClearProgram = await compileProgram(client, clearProgramTeal);

  return algosdk.makeApplicationCreateTxnFromObject({
    from: deployerAddress,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    approvalProgram: compileApprovalProgram,
    clearProgram: compileClearProgram,
    numGlobalByteSlices,
    numGlobalInts,
    numLocalByteSlices,
    numLocalInts,
    appArgs,
    accounts,
  });
};

export default deployOracleTx;
