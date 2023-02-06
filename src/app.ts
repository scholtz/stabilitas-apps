import { setTimeout } from "timers/promises";
import IConfiguration from "./interface/IConfiguration";

import ConfigJson from "../.config/app.json";
import parseECB from "./stabilitas/parseECB";
import getISO4217ToTokenId from "./stabilitas/getISO4217ToTokenId";
import algosdk from "algosdk";
import IPricePair from "./interface/IPricePair";
import updateOraclePriceCreatePayload from "./multiSig/oracle/updateOraclePriceCreatePayload";
import msigAppendSignature from "./multiSig/msigAppendSignature";
import msigSubmit from "./multiSig/msigSubmit";

const app = async () => {
  console.log(`${Date()} App started`);
  let working = true;
  process.once("SIGINT", function (code) {
    console.log("SIGINT received...");
    working = false;
  });
  process.once("SIGTERM", function (code) {
    console.log("SIGTERM received...");
    working = false;
  });

  const indexerToken =
    <string>process.env.algodToken ?? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const indexerServer = <string>process.env.algodServer ?? "http://localhost";
  const indexerPort = <string>process.env.algodPort ?? 8980;
  const indexer = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);

  const algodServer = <string>process.env.algodServer ?? "http://localhost";
  const algodPort = <string>process.env.algodPort ?? 4001;
  const algodToken =
    <string>process.env.algodToken ?? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
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

  var config: IConfiguration = ConfigJson;
  let last = new Date();
  var firsRun = true;
  var lastJson = "";
  const curr2asset = await getISO4217ToTokenId({ indexer, tokensAppId: config.tokensAppId });

  while (working) {
    //console.log(`${last.getTime() + config.period} vs ${new Date().getTime()}`);
    if (firsRun || last.getTime() + config.period < new Date().getTime()) {
      console.log(`${new Date()} trying to fetch ${config.period} ${last.getTime() + config.period}`);

      var data = await parseECB();
      var json = JSON.stringify(data);
      if (json.length > 50 && json != lastJson) {
        // store to blockchain
        console.log(`${new Date()} new data found ${json}`);
        const prices: IPricePair[] = [];
        Object.keys(curr2asset).forEach((currency) => {
          if (currency in data) {
            prices.push({ asset: curr2asset[currency], price: Math.round(data[currency] * 10_000_000) });
          }
        });
        console.log("toUpdate", prices);
        let payload = await updateOraclePriceCreatePayload({
          client,
          from: msigAccount,
          msigConfig,
          oracleFeedAppId: config.oracleFeedAppId,
          prices: prices,
          signator: msigSig1,
        });
        payload = msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
        const tx = await msigSubmit({ client, payload });
        console.log(`Submitted in tx: ${tx}`);
        lastJson = json;
      }

      last = new Date();
      firsRun = false;
    }
    await setTimeout(100);
  }
};

app();
