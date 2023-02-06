import algosdk from "algosdk";
import getLogger from "./common/getLogger";
import fundAccount from "./basicSig/fundAccount";
import getISO4217ToTokenId from "./stabilitas/getISO4217ToTokenId";
import deployAMMContract from "./basicSig/amm/deployAMMContract";
import configureAMMCLT from "./basicSig/amm/configureAMMCLT";
import configureAMMOptIn from "./basicSig/amm/configureAMMOptIn";

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

  const tokensAppId: number = parseInt(<string>process.env.tokensAppId ?? "");
  const assetOracleBase: number = parseInt(<string>process.env.assetOracleBase ?? "0");

  const curr2asset = await getISO4217ToTokenId({ indexer, tokensAppId });

  await Object.keys(curr2asset).forEach(async (curr) => {
    const assetA = curr2asset[curr];
    const assetB = assetOracleBase;
    const ammAppId = await deployAMMContract({
      client,
      deployerAccount: sender,
      assetA,
      assetB,
    });
    console.log(`amm created: ${ammAppId}`);
    await fundAccount({ amount: 400_000, client, receiver: algosdk.getApplicationAddress(ammAppId), sender });
    const ammTokenId = await configureAMMCLT({
      client,
      sender,
      ammApp: ammAppId,
      assetA,
      assetB,
    });
    console.log(`TokenId: ${ammTokenId}`);
    await configureAMMOptIn({
      client,
      sender,
      ammApp: ammAppId,
      assetA,
      assetB,
    });
  });
};

app();
