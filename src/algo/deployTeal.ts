import algosdk from "algosdk";
import { compileProgram } from "./compileProgram";
import { signAndSubmitTransaction } from "./signAndSubmitTransaction";

export async function deployTeal(
  algodClient: algosdk.Algodv2,
  creatorAccount: algosdk.Account,
  approvalProgramCode: string,
  clearProgramCode: string,
  fee: number,
  numGlobalByteSlices: number,
  numGlobalInts: number,
  numLocalByteSlices: number,
  numLocalInts: number,
  appArgs: Uint8Array[],
  accounts?: string[]
): Promise<[number, string]> {
  const params = await algodClient.getTransactionParams().do();
  params.fee = fee;
  params.flatFee = true;
  const compileApprovalProgram = await compileProgram(algodClient, approvalProgramCode);
  //console.log("compileApprovalProgram", Buffer.from(compileApprovalProgram).toString("base64"));
  const compileClearProgram = await compileProgram(algodClient, clearProgramCode);

  const txn = algosdk.makeApplicationCreateTxnFromObject({
    from: creatorAccount.addr,
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

  const txnDetails = await signAndSubmitTransaction(algodClient, creatorAccount, txn);
  const appId = parseInt(txnDetails.response["application-index"]);
  const appAddr = algosdk.getApplicationAddress(appId);
  return [appId, appAddr];
}
export default deployTeal;
