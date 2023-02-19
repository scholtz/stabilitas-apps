import algosdk from "algosdk";

const computeTransactionId = (gh: Buffer, gen: string, stib: any) => {
  const t = stib.txn as algosdk.EncodedTransaction;

  // Manually add gh/gen to construct a correct transaction object
  t.gh = gh;
  t.gen = gen;

  const stxn = {
    txn: algosdk.Transaction.from_obj_for_encoding(t),
  } as algosdk.SignedTransaction;

  if ("sig" in stib) {
    stxn.sig = stib.sig;
  }

  if ("lsig" in stib) {
    stxn.lsig = stib.lsig;
  }

  if ("msig" in stib) {
    stxn.msig = stib.msig;
  }

  if ("sgnr" in stib) {
    stxn.sgnr = stib.sgnr;
  }

  return stxn.txn.txID();
};
export default computeTransactionId;
