import algosdk from "algosdk";
import * as fs from "fs";
import compileProgram from "../../algo/compileProgram";

interface InputObject {
  deployerAddress: string;
  client: algosdk.Algodv2;
  assetA: number;
  assetB: number;
}
const deployAMMTx = async (input: InputObject) => {
  const { deployerAddress, client, assetA, assetB } = input;
  let approvalProgramTeal = fs.readFileSync("onchain/contracts/amm/contract.teal", {
    encoding: "utf8",
  });
  const clearProgramTeal = fs.readFileSync("onchain/contracts/amm/contractClear.teal", { encoding: "utf8" });
  const fee = 1000;
  const numGlobalByteSlices = 4;
  const numGlobalInts = 7;
  const numLocalByteSlices = 0;
  const numLocalInts = 0;
  const appArgs: Uint8Array[] = [];
  const accounts: string[] = [];

  const decoded = algosdk.decodeAddress(deployerAddress);
  const hex = "0x" + Buffer.from(decoded.publicKey).toString("hex");
  approvalProgramTeal = approvalProgramTeal.replace(
    /0x67600a8277b4aea252a3c93a590433eaaf35486bc5ea777493a22afd100fa80e/g,
    hex
  );
  approvalProgramTeal = approvalProgramTeal.replace(/37074699/g, `${assetA}`);
  approvalProgramTeal = approvalProgramTeal.replace(/94115664/g, `${assetB}`);
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
    foreignAssets: [assetA, assetB],
  });
};

export default deployAMMTx;
