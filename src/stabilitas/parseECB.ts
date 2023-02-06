import { parseString } from "xml2js";
import axios from "axios";
import { randomUUID } from "crypto";
import * as htmlparser2 from "htmlparser2";
interface IECBDataItem {
  currency: string;
  rate: number;
}
interface IECBCurrency2Rate {
  [currency: string]: number;
}
const parseECB = async () => {
  const rand = randomUUID();
  const xml = await axios.get(`https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml?${rand}`);
  //console.log("xml", xml);
  const ecbRates: IECBCurrency2Rate = {};
  ecbRates["EUR"] = 1;

  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      //console.log("name", name);
      if (name === "cube") {
        //console.log("cube", attributes);
        if (attributes["currency"] && attributes["rate"]) {
          ecbRates[attributes["currency"]] = parseFloat(attributes["rate"]);
        }
      }
    },
  });

  parser.write(xml.data);
  parser.end();
  var usdRates: IECBCurrency2Rate = {};
  if (!ecbRates["USD"]) return {};
  Object.keys(ecbRates)
    .sort()
    .forEach((curr) => {
      usdRates[curr] = Math.round((ecbRates[curr] / ecbRates["USD"]) * 10_000_000) / 10_000_000;
    });

  return usdRates;
  //const dom = htmlparser2.parseDocument(xml.data);

  //console.log("Cube", dom);
  /*
  var str = parseString(xml.data);
  console.log("str", str);
  return parseString(xml.data, function (err, results) {
    // parsing to json
    let data = JSON.stringify(results);

    // display the json data
    console.log("results", data);
    console.log("results", JSON.parse(data));
    console.log("results.Cube", results["gesmes:Envelope"].Cube[0].Cube[0].Cube);
    if (results["gesmes:Envelope"].Cube[0].Cube[0].Cube) {
      const ret: any = [];
      results["gesmes:Envelope"].Cube[0].Cube[0].Cube.forEach((element) => {
        console.log("element", element["$"]);
        ret.push(element["$"].currency);
      });
      console.log("ret", ret);
      return ret;
    }
  });*/
};
export default parseECB;
