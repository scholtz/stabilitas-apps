import { readFileSync, writeFileSync } from "fs";
import currencies from "../../.config/currencies.json";
import publishFileBuffer from "../ipfs/publishFileBuffer";
import CryptoJS from "crypto-js";
import parseECB from "./parseECB";
const createArc3Files = async () => {
  const data = await parseECB();
  currencies.forEach(async (element) => {
    //if (element.alpha != "EUR") return;
    if (!(element.alpha in data)) return; // put to ipfs only ecb currencies
    console.log(element.alpha);
    const file = readFileSync(`./icons/${element.alpha}.svg`);
    const ipfs = await publishFileBuffer(file);
    const integrity = CryptoJS.SHA256(CryptoJS.enc.Base64.parse(file.toString("base64"))).toString(CryptoJS.enc.Base64);

    const template = {
      name: element.alpha,
      description: `Stabilitas ${element.alpha} token representing ${element.name}`,
      image: `ipfs://${ipfs}`,
      image_integrity: `sha256-${integrity}`,
      image_mimetype: "image/svg+xml",
      external_url: `https://testnet.stabilitas.finance/currency/${element.alpha}`,
    };

    const jsonFile = JSON.stringify(template);
    writeFileSync(`./arc0003/${element.alpha}.json`, jsonFile, {
      flag: "w",
    });
    console.log(`./arc0003/${element.alpha}.json done`);

    const fileJ = readFileSync(`./arc0003/${element.alpha}.json`);
    const ipfsJ = await publishFileBuffer(fileJ);
    const integrityJ = CryptoJS.SHA256(CryptoJS.enc.Base64.parse(fileJ.toString("base64"))).toString(
      CryptoJS.enc.Base64
    );
    writeFileSync(`./arc0003/${element.alpha}.ipfs`, ipfsJ, {
      flag: "w",
    });
    writeFileSync(`./arc0003/${element.alpha}.integrity`, integrityJ, {
      flag: "w",
    });
  });
};
export default createArc3Files;
