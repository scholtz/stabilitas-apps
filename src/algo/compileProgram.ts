//
// Loads and compiles a TEAL program.

import algosdk from "algosdk";

//
export async function compileProgram(client: algosdk.Algodv2, sourceCode: string) {
  //console.log("sourceCode", sourceCode);
  const compileResponse = await client
    .compile(sourceCode)
    .do()
    .catch((e) => {
      console.log("error compiling", e.response.body);
      //console.log("error compiling", Buffer.from(e.response._data).toString("utf-8"));
    });
  //console.log("compileResponse", compileResponse);
  return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}
export default compileProgram;
