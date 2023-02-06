import algosdk from "algosdk";
import { readFileSync } from "fs";
import getLogger from "./common/getLogger";
import msigAppendSignature from "./multiSig/msigAppendSignature";
import deployOracleCreatePayload from "./multiSig/oracle/deployOracleCreatePayload";
import deployExecute from "./multiSig/deployExecute";
import setInitPriceCreatePayload from "./multiSig/oracle/setInitPriceCreatePayload";
import tokenIssueExecute from "./multiSig/tokenIssueExecute";
import parseECB from "./stabilitas/parseECB";
import fundAccount from "./basicSig/fundAccount";
import getISO4217ToTokenId from "./stabilitas/getISO4217ToTokenId";
import msigSubmit from "./multiSig/msigSubmit";

const app = async () => {
  const logger = getLogger();
  logger.info(`${Date()} App started - deploy oracle`);

  let oracleECBAppId = parseInt(<string>process.env.oracleECBAppId ?? "0");
  const mnemonic: string = <string>process.env.mnemonic ?? "";
  let sender = algosdk.mnemonicToSecretKey(mnemonic);

  const algodServer = <string>process.env.algodServer ?? "http://localhost";
  const algodPort = <string>process.env.algodPort ?? 4001;
  const algodToken =
    <string>process.env.algodToken ?? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  const indexerToken =
    <string>process.env.algodToken ?? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const indexerServer = <string>process.env.algodServer ?? "http://localhost";
  const indexerPort = <string>process.env.algodPort ?? 8980;
  const indexer = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);

  const mnSig1: string = <string>process.env.mnSig1 ?? "";
  const msigSig1 = algosdk.mnemonicToSecretKey(mnSig1);
  const mnSig2: string = <string>process.env.mnSig2 ?? "";
  const msigSig2 = algosdk.mnemonicToSecretKey(mnSig2);
  const tokensAppId: number = parseInt(<string>process.env.tokensAppId ?? "");

  var msigConfig: algosdk.MultisigMetadata = {
    addrs: [msigSig1.addr, msigSig2.addr].sort(),
    threshold: 2,
    version: 1,
  };
  const msigAccount = <string>process.env.msig ?? algosdk.multisigAddress(msigConfig);
  //await fundAccount({ client, sender, receiver: msigAccount, amount: 1_000_000 });
  if (!oracleECBAppId) {
    logger.info(`going to deploy tokens app`);
    let payload = await deployOracleCreatePayload({
      client,
      deployerAddress: msigAccount,
      priceProviderAddress: msigAccount,
      msigConfig,
      signator: msigSig1,
    });
    payload = await msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    oracleECBAppId = await deployExecute({ client, payload });
    logger.info(`${Date()} oracleECBAppId: ${oracleECBAppId}`);
  }
  var data = await parseECB();
  const curr2asset = await getISO4217ToTokenId({ indexer, tokensAppId: tokensAppId });
  Object.keys(data).forEach(async (currency) => {
    if (!(currency in curr2asset)) return;
    const price = Math.round(data[currency] * 10_000_000);
    const asset = curr2asset[currency];
    let payload = await setInitPriceCreatePayload({
      client,
      from: msigAccount,
      msigConfig,
      signator: msigSig1,
      asset: asset,
      oracleFeedAppId: oracleECBAppId,
      price: price,
    });

    payload = msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    const setInitPriceCreatePayloadTx = await msigSubmit({ client, payload });
    console.log(`setInitPriceCreatePayloadTx ${currency}: ${asset}=${price} ${setInitPriceCreatePayloadTx}`);
  });
};

app();
