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
import mintStToken from "../src/basicSig/reserve/mintStToken";

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

let reserveAppId = parseInt(<string>process.env.reserveAppId ?? "0");
let oracleECBAppId = parseInt(<string>process.env.oracleECBAppId ?? "0");
let oracleAMMVWAP1W = parseInt(<string>process.env.oracleAMMVWAP1W ?? "0");
let oracleAMMVWAP1H = parseInt(<string>process.env.oracleAMMVWAP1H ?? "0");
let tokensAppId = parseInt(<string>process.env.tokensAppId ?? "0");
let assetOracleBase = parseInt(<string>process.env.assetOracleBase ?? "0");
let addrFee = <string>process.env.addrFee;

describe("mint burn tests", () => {
  it("test mint", async function () {
    const claimAsset = 743; // CZK
    await optInToAsa(client, sender, claimAsset);
    const tx = await mintStToken({
      client,
      sender,
      reserveAppId,
      addrFee,
      oracleECB: oracleECBAppId,
      oracleAMM1W: oracleAMMVWAP1W,
      oracleAMM1H: oracleAMMVWAP1H,
      tokensApp: tokensAppId,
      depositAsset: assetOracleBase,
      claimAsset,
      depositAmount: 100_000_000, // 100 USDc
      minimumToReceive: 1,
    });
    console.log(`TX: ${tx}`);
    expect(tx).toBeDefined();
  });
});
