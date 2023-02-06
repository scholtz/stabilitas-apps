import algosdk, { generateAccount } from "algosdk";
import getLogger from "./common/getLogger";
import msigAppendSignature from "./multiSig/msigAppendSignature";
import deployCreatePayload from "./multiSig/reserve/deployCreatePayload";
import deployExecute from "./multiSig/deployExecute";
import fundAccount from "./basicSig/fundAccount";
import configureVariablesCreatePayload from "./multiSig/reserve/configureVariablesCreatePayload";
import msigSubmit from "./multiSig/msigSubmit";
import configureOraclesCreatePayload from "./multiSig/reserve/configureOraclesCreatePayload";

import setReserveContractCreatePayload from "./multiSig/tokens/setReserveContractCreatePayload";
import rekeyToApp from "./basicSig/rekeyToApp";
import optInToAsa from "./basicSig/optInToAsa";

const app = async () => {
  const logger = getLogger();
  logger.info(`${Date()} App started`);

  let reserveAppId = parseInt(<string>process.env.reserveAppId ?? "0");
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

  let addrFee: string = <string>process.env.addrFee ?? "STABLE2GROSYKRJLESU467VEGVTIS5A57AZJDRAGJONL72VR4KBKKO3D4Y";
  const addrLPFee: string =
    <string>process.env.addrLPFee ?? "STABLE3J7M3ITMAMXV37F62VKKWDJVTTUH25KSSV4XJOTZIRWV4FU4YPZE";

  const appAMM: number = parseInt(<string>process.env.appAMM ?? "0");
  const tokensAppId: number = parseInt(<string>process.env.tokensAppId ?? "0");
  const assetAMMLP: number = parseInt(<string>process.env.assetAMMLP ?? "0");

  const exitFee: number = parseInt(<string>process.env.exitFee ?? "50"); // /10000
  const lpFee: number = parseInt(<string>process.env.lpFee ?? "20");
  const negativeFee: number = parseInt(<string>process.env.negativeFee ?? "30");
  const protocolFee: number = parseInt(<string>process.env.protocolFee ?? "1");

  const stopPriceLow: number = parseInt(<string>process.env.stopPriceLow ?? "200");
  const stopPriceTop: number = parseInt(<string>process.env.stopPriceTop ?? "200");

  const assetOracleBase: number = parseInt(<string>process.env.assetOracleBase ?? "0");

  const oracleECBAppId: number = parseInt(<string>process.env.oracleECBAppId ?? "0");
  const oracleAMMVWAP1W: number = parseInt(<string>process.env.oracleAMMVWAP1W ?? "0");
  const oracleAMMVWAP1H: number = parseInt(<string>process.env.oracleAMMVWAP1H ?? "0");

  const oracleECBWeight: number = parseInt(<string>process.env.oracleECBWeight ?? "9000");
  const oracleAMMVWAP1WWeight: number = parseInt(<string>process.env.oracleAMMVWAP1WWeight ?? "1000");
  const oracleAMMVWAP1HWeight: number = parseInt(<string>process.env.oracleAMMVWAP1HWeight ?? "0");

  var msigConfig: algosdk.MultisigMetadata = {
    addrs: [msigSig1.addr, msigSig2.addr].sort(),
    threshold: 2,
    version: 1,
  };
  const msigAccount = <string>process.env.msig ?? algosdk.multisigAddress(msigConfig);
  await fundAccount({ client, sender, receiver: msigAccount, amount: 1_000_000 });
  if (!reserveAppId) {
    logger.info(`going to deploy reserve app`);
    let payload = await deployCreatePayload({ client, from: msigAccount, msigConfig, signator: msigSig1 });
    payload = await msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    reserveAppId = await deployExecute({ client, payload });
    logger.info(`${Date()} reserveAppId: ${reserveAppId}`);
    await fundAccount({ client, sender, receiver: algosdk.getApplicationAddress(reserveAppId), amount: 10_000_000 });
  }
  if (true) {
    // configure
    console.log("configureVariablesCreatePayload");
    const feeAccount = algosdk.generateAccount();
    addrFee = feeAccount.addr;
    console.log(`addrFee=${addrFee}`);
    await fundAccount({ amount: 1000000, client, receiver: feeAccount.addr, sender });
    await optInToAsa(client, feeAccount, assetOracleBase);
    await rekeyToApp({ sender: feeAccount, app: reserveAppId, client });
    let payload = await configureVariablesCreatePayload({
      client,
      from: msigAccount,
      signator: msigSig1,
      reserveAppId,
      addrFee,
      addrLPFee,
      appAMM,
      appTokens: tokensAppId,
      assetAMMLP,
      assetOracleBase,
      exitFee,
      lpFee,
      msigConfig,
      negativeFee,
      protocolFee,
      stopPriceLow,
      stopPriceTop,
    });
    payload = await msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    const txId = await msigSubmit({ client, payload });
    console.log(`configureVariablesCreatePayload ${txId}`);
  }
  if (true) {
    // configure
    console.log("configureOraclesCreatePayload");
    let payload = await configureOraclesCreatePayload({
      client,
      from: msigAccount,
      signator: msigSig1,
      reserveAppId,
      assetOracleBase,
      msigConfig,
      oracleAMMVWAP1H,
      oracleAMMVWAP1W,
      oracleECB: oracleECBAppId,
      oracleECBWeight,
      oracleAMMVWAP1WWeight,
      oracleAMMVWAP1HWeight,
    });
    payload = await msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    const txId = await msigSubmit({ client, payload });
    console.log(`configureOraclesCreatePayload ${txId}`);
  }
  if (true) {
    // bind the reserve app with tokens app so that reserve app can make transfer
    console.log("setReserveContractCreatePayload");
    let payload = await setReserveContractCreatePayload({
      client,
      from: msigAccount,
      signator: msigSig1,
      tokensAppId,
      reserveAppId,
      msigConfig,
    });
    payload = await msigAppendSignature({ msigConfig, payload, signator: msigSig2 });
    const txId = await msigSubmit({ client, payload });
    console.log(`setReserveContractCreatePayload ${txId}`);
  }
};

app();
