import algosdk from "algosdk";
import * as fs from "fs";
import compileProgram from "../../algo/compileProgram";

interface InputObject {
  deployerAddress: string;
  client: algosdk.Algodv2;
}
const deployTokenTx = async (input: InputObject) => {
  const { deployerAddress, client } = input;
  let approvalProgramTeal = fs.readFileSync("onchain/build/Tokens.teal", {
    encoding: "utf8",
  });
  const clearProgramTeal = fs.readFileSync("onchain/build/TokensClear.teal", { encoding: "utf8" });
  const fee = 1000;
  const numGlobalByteSlices = 1;
  const numGlobalInts = 63;
  const numLocalByteSlices = 0;
  const numLocalInts = 0;
  const appArgs: Uint8Array[] = [];

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
  });
};

export default deployTokenTx;
