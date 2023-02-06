import { setTimeout } from "timers/promises";
import algosdk from "algosdk";
import nacl from "tweetnacl";

import fundAccount from "../src/basicSig/fundAccount";

import fundAccountAsa from "../src/basicSig/fundAccountAsa";
import optInToAsa from "../src/basicSig/optInToAsa";

import deployOracleFeedContract from "../src/basicSig/oracle/deployOracleFeedContract";
import createTestAsset from "../src/basicSig/createTestAsset";
import setInitPrice from "../src/basicSig/oracle/setInitPrice";
import updateOraclePriceCreatePayload from "../src/multiSig/oracle/updateOraclePriceCreatePayload";
import msigAppendSignature from "../src/multiSig/msigAppendSignature";
import IPricePair from "../src/interface/IPricePair";
import submitTransaction from "../src/algo/submitTransaction";

const tealFolder = "./onchain/build/";
const algodServer = <string>process.env.algodServer ?? "http://localhost";
const algodPort = <string>process.env.algodPort ?? 4001;
const algodToken = <string>process.env.algodToken ?? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const indexerToken =
  <string>process.env.algodToken ?? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const indexerServer = <string>process.env.algodServer ?? "http://localhost";
const indexerPort = <string>process.env.algodPort ?? 8980;

const mnemonic: string = <string>process.env.mnemonic ?? "";
let sender = algosdk.mnemonicToSecretKey(mnemonic);

const ownerAccount = algosdk.generateAccount();
const collateralAccount = algosdk.generateAccount();

let glbl_appId = 0;
let glbl_appAddr = "0";

//we will deploy three limitOrders which are linked
let positionAppId = parseInt(<string>process.env.positionAppId ?? "0");
let collateralAssetId = parseInt(<string>process.env.collateralAssetId ?? "0");
let oracleApp = parseInt(<string>process.env.oracleApp ?? "0");
let positionContractAddress = <string>process.env.positionContractAddress;
let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const mnSig1: string = <string>process.env.mnSig1 ?? "";
const msigSig1 = algosdk.mnemonicToSecretKey(mnSig1);
const mnSig2: string = <string>process.env.mnSig2 ?? "";
const msigSig2 = algosdk.mnemonicToSecretKey(mnSig2);

var msigConfig: algosdk.MultisigMetadata = {
  addrs: [msigSig1.addr, msigSig2.addr].sort(),
  threshold: 2,
  version: 1,
};
const msigAccount = algosdk.multisigAddress(msigConfig);

describe("test ECB oracle", () => {
  beforeAll(async () => {
    let params = await client.getTransactionParams().do();
    // if app is not deployed, deploy
    /**
     * Create USDC asset for testing
     */
    if (collateralAssetId == 0) {
      collateralAssetId = await createTestAsset(client, sender);
      expect(collateralAssetId).toBeGreaterThan(0);
    }
    await fundAccount({ client, sender, receiver: ownerAccount.addr, amount: 10000000 });
    await fundAccount({ client, sender, receiver: msigAccount, amount: 10000000 });
    await optInToAsa(client, ownerAccount, collateralAssetId);
    await fundAccountAsa(client, sender, ownerAccount.addr, collateralAssetId, 3000000 * 10 ** 8);
    /**
     * Initialize oracle
     */
    let deployOracle = true;
    if (deployOracle || oracleApp == 0) {
      oracleApp = await deployOracleFeedContract({
        client,
        deployerAccount: sender,
        priceProviderAccount: msigAccount,
      });
      await setInitPrice({
        asset: collateralAssetId,
        client,
        oracleApp,
        price: 1 * 10 ** 8, // 1 usdc/usd
        priceFeedProviderAccount: sender,
      });
    }
  });

  it("app deployed", async function () {
    expect(oracleApp).toBeGreaterThan(0);
  });

  it("update price price feed 1", async function () {
    console.log("from", msigAccount, msigConfig);
    //const asset1 = 0; // algo
    //const price1 = 32_000_002; // 1

    const asset2 = collateralAssetId; // usdc token id
    const price2 = 100_000_001; // 1
    var prices: IPricePair[] = [];
    //prices.push({ asset: asset1, price: price1 });
    prices.push({ asset: asset2, price: price2 });

    let rawSignedTxn = await updateOraclePriceCreatePayload({
      client,
      signator: msigSig1,
      from: msigAccount,
      msigConfig,
      oracleFeedAppId: oracleApp,
      prices,
    });
    let rawSignedTxn2 = msigAppendSignature({
      signator: msigSig2,
      msigConfig,
      payload: rawSignedTxn,
    });

    const toSend = new Uint8Array(Buffer.from(rawSignedTxn2, "base64url"));
    //const signedTx1 = tx1.signTxn(signer3.sk);
    const submitted = await submitTransaction(client, toSend);
    expect(!!submitted.txId).toBe(true);

    await setTimeout(5000);

    const indexer = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);
    const app = await indexer.lookupApplications(oracleApp).do();
    var collateralAssetIdBase64 = Buffer.from(algosdk.bigIntToBytes(collateralAssetId, 8)).toString("base64");
    const asset1State = app.application.params["global-state"].find((k) => k.key == collateralAssetIdBase64); //asset1
    const buffAsset1 = Buffer.from(asset1State.value.bytes, "base64").toString("hex");
    const price = buffAsset1.substring(0, 16);
    const time = buffAsset1.substring(16);
    expect(price).toBe("0000000005f5e101"); // 100_000_001 dec
    //console.log("buffAsset1", buffAsset1);
  });
});
