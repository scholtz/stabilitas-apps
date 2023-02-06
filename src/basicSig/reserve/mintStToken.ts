import algosdk from "algosdk";
import mintStTokenTx from "../../txs/reserve/mintStTokenTx";

interface InputObject {
  client: algosdk.Algodv2;
  sender: algosdk.Account;
  reserveAppId: number;
  addrFee: string;
  oracleECB: number;
  oracleAMM1W: number;
  oracleAMM1H: number;
  tokensApp: number;
  depositAsset: number;
  claimAsset: number;
  depositAmount: number;
  minimumToReceive: number;
}

const mintStToken = async (input: InputObject) => {
  const {
    client,
    sender,
    reserveAppId,
    addrFee,
    oracleECB,
    oracleAMM1W,
    oracleAMM1H,
    tokensApp,
    depositAsset,
    claimAsset,
    depositAmount,
    minimumToReceive,
  } = input;

  let params = await client.getTransactionParams().do();
  const txns = mintStTokenTx({
    params,
    reserveAppId,
    sender: sender.addr,
    addrFee,
    oracleECB,
    oracleAMM1W,
    oracleAMM1H,
    tokensApp,
    depositAsset,
    claimAsset,
    depositAmount,
    minimumToReceive,
  });
  const signedTx = [txns[0].signTxn(sender.sk), txns[1].signTxn(sender.sk)];

  const sendResult = await client
    .sendRawTransaction(signedTx)
    .do()
    .catch((e) => {
      expect(e).toBeFalsy();
      console.log("e", e);
    });
  return sendResult.txId;
};

export default mintStToken;
