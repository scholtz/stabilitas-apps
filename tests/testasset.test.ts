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

describe("test asset creation", () => {
  it("test asset", async function () {
    const asset = await createTestAsset(client, sender);
    console.log(`Test asset created: ${asset}`);
    expect(asset).toBeGreaterThan(0);
  });
});
