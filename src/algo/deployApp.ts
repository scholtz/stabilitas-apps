import algosdk from "algosdk";
import * as fs from "fs";
import { deployTeal } from "./deployTeal";

async function deployApp(
  client: algosdk.Algodv2,
  creator: algosdk.Account,
  approvalProgramCodePath: string,
  clearProgramCodePath: string,
  fee: number,
  initialValue: number,
  glbl_bytes: number,
  glbl_ints: number,
  local_bytes: number,
  local_ints: number,
  appArgs: Uint8Array[],
  accounts?: string[]
): Promise<[number, string]> {
  // compile teal code in build folder
  const approvalProgramTeal = fs.readFileSync(approvalProgramCodePath, { encoding: "utf8" });
  const clearProgramTeal = fs.readFileSync(clearProgramCodePath, { encoding: "utf8" });
  // Deploy the smart contract.
  const [appId, appAddr] = await deployTeal(
    client,
    creator,
    approvalProgramTeal,
    clearProgramTeal,
    fee,
    glbl_bytes,
    glbl_ints,
    local_bytes,
    local_ints,
    appArgs,
    accounts
  );
  return [appId, appAddr];
}

export default deployApp;
