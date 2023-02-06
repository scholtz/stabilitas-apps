import algosdk from "algosdk";
import { readFileSync } from "fs";
import getLogger from "./common/getLogger";
import msigAppendSignature from "./multiSig/msigAppendSignature";
import deployCreatePayload from "./multiSig/tokens/deployCreatePayload";
import deployExecute from "./multiSig/deployExecute";
import issueTokenCreatePayload from "./multiSig/tokens/issueTokenCreatePayload";
import tokenIssueExecute from "./multiSig/tokenIssueExecute";
import parseECB from "./stabilitas/parseECB";
import fundAccount from "./basicSig/fundAccount";

const app = async () => {
  const logger = getLogger();
  logger.info(`${Date()} App started`);

  let tokensAppId = parseInt(<string>process.env.tokensAppId ?? "0");
  const mnemonic: string = <string>process.env.mnemonic ?? "";
  let sender = algosdk.mnemonicToSecretKey(mnemonic);

  const algodServer = <string>process.env.algodServer ?? "http://localhost";
  const algodPort = <string>process.env.algodPort ?? 4001;
  const algodToken =
    <string>process.env.algodToken ?? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

  const mnSig1: string = <string>process.env.mnSig1 ?? "";
  const msigSig1 = algosdk.mnemonicToSecretKey(mnSig1);
  const mnSig2: string = <string>process.env.mnSig2 ?? "";
  const msigSig2 = algosdk.mnemonicToSecretKey(mnSig2);
  const clawback: string = <string>process.env.clawback ?? "";
  const freeze: string = <string>process.env.freeze ?? "";

  var msigConfig: algosdk.MultisigMetadata = {
    addrs: [msigSig1.addr, msigSig2.addr].sort(),
    threshold: 2,
    version: 1,
  };
  const msigAccount = <string>process.env.msig ?? algosdk.multisigAddress(msigConfig);
  await fundAccount({ client, sender, receiver: msigAccount, amount: 1_000_000 });
  if (!tokensAppId) {
    logger.info(`going to deploy tokens app`);
    let payload = await deployCreatePayload({ client, from: msigAccount, msigConfig, signator: msigSig1 });
    payload = await msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    tokensAppId = await deployExecute({ client, payload });
    logger.info(`${Date()} tokensAppId: ${tokensAppId}`);
    await fundAccount({ client, sender, receiver: algosdk.getApplicationAddress(tokensAppId), amount: 10_000_000 });
  }
  var data = await parseECB();
  Object.keys(data).forEach(async (currency) => {
    //if (currency != "EUR") return;
    const ipfsLinkToJson = readFileSync(`./arc0003/${currency}.ipfs`);
    const url = `ipfs://${ipfsLinkToJson.toString()}#arc3`;
    const base64Hash = readFileSync(`./arc0003/${currency}.integrity`).toString();
    const hash = new Uint8Array(Buffer.from(base64Hash, "base64"));

    let payload = await issueTokenCreatePayload({
      client,
      from: msigAccount,
      msigConfig,
      signator: msigSig1,
      clawback,
      freeze,
      hash,
      name: currency,
      tokensAppId,
      unit: currency,
      url,
    });

    payload = msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    const token = await tokenIssueExecute({ client, payload });
    console.log(`Issued token ${token} for ${currency}`);
  });
};

app();
