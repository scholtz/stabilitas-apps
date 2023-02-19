import { setTimeout } from "timers/promises";
import IAMMOracleConfiguration from "./interface/IAMMOracleConfiguration";

import ConfigAMMJson from "../.config/amm.json";
import algosdk from "algosdk";
import IPricePair from "./interface/IPricePair";
import updateOraclePriceCreatePayload from "./multiSig/oracle/updateOraclePriceCreatePayload";
import msigAppendSignature from "./multiSig/msigAppendSignature";
import msigSubmit from "./multiSig/msigSubmit";
import computeTransactionId from "./algo/computeTransactionId";
import getPriceAndVolumeFromPactTxn from "./pact/getPriceAndVolumeFromPactTxn";
import VWAPDB from "./interface/VWAPDB";
import timeWeightedVWAP from "./stabilitas/timeWeightedVWAP";

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

  const processBlocks = parseInt(<string>process.env.processBlocks ?? "1000"); // 17*60=1020 1000 rounds is approx one hour on algorand

  const algodServer = <string>process.env.algodServer ?? "http://localhost";
  const algodPort = parseInt(<string>process.env.algodPort ?? "4001");
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

  var configAMMJson: IAMMOracleConfiguration = ConfigAMMJson;

  console.log(`loading initParams`);
  const initParams = await client.getTransactionParams().do();
  console.log(`initParams`, initParams);
  // initParams.firstRound // current round
  let roundToProcess = initParams.firstRound - processBlocks;
  // roundToProcess = 27835843;
  //roundToProcess = 27836630;
  // roundToProcess = 27835843;

  const blockData: VWAPDB = {};
  while (working) {
    console.log(`processing ${roundToProcess}`);
    const status = await client.statusAfterBlock(roundToProcess).do();
    const block = await client.block(roundToProcess).do();
    const toStore = {};
    for (const ammConfig of configAMMJson.items) {
      let blockPrice = 0;
      let blockVolume = 0;
      if (block.block.txns) {
        for (const stxn of block.block.txns) {
          try {
            //const txId = computeTransactionId(block.block.gh, block.block.gen, stxn);
            // if (roundToProcess == 27835843 && txId != "WEIPRELYEJ5GZ3Y4MR3A4VKRR7U53QAMZADJQQBWCRVC3FJDL42Q") continue;
            // if (roundToProcess == 27836630 && txId != "QK66JCNLCOW5PGWTA7HLADEXT7K72HPESSDZDG2HNP7TB5HP6EUA") continue;
            // if (roundToProcess == 27836788 && txId != "KIHPYGXTAXQ3CCZP72NNAINKJZ5O6MPUUCU6WNWYJJDNLSKQ25PQ") continue;
            const ret = getPriceAndVolumeFromPactTxn(stxn, ammConfig.appAMM, ammConfig.pimarySide, ammConfig.baseAsset);
            if (ret.volume > 0) {
              console.log("ret", ret);
              blockPrice = (blockPrice * blockVolume + ret.price * ret.volume) / (blockVolume + ret.volume);
              blockVolume = blockVolume + ret.volume;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      if (blockVolume > 0) {
        blockData[roundToProcess] = { price: blockPrice, volume: blockVolume };
      }
      const oldRound = roundToProcess - processBlocks;
      if (oldRound in blockData) {
        // cleanup old data
        delete blockData[oldRound];
      }

      if (roundToProcess % 10 == 0) {
        const weighted = timeWeightedVWAP(blockData, roundToProcess, oldRound);
        console.log("weighted", weighted);
        if (weighted > 0) {
          // TODO: there is simplification at the moment that the only amm is feeded to single oracle feed
          toStore[ammConfig.stAsset] = weighted;
        }
      }
    }
    const prices = Object.keys(toStore).map((asset) => {
      const pair: IPricePair = { asset: parseInt(asset), price: Math.round(toStore[asset] * 10_000_000) };
      return pair;
    });
    if (prices.length > 0) {
      console.log("toUpdate", prices);
      let payload = await updateOraclePriceCreatePayload({
        client,
        from: msigAccount,
        msigConfig,
        oracleFeedAppId: configAMMJson.oracleFeedAppId,
        prices: prices,
        signator: msigSig1,
      });
      payload = msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
      const tx = await msigSubmit({ client, payload });
      console.log(`Submitted in tx: ${tx}`); /**/
    }

    roundToProcess++;
    await setTimeout(100);
    //if (roundToProcess > 27836988) return;
  }
};

app();
