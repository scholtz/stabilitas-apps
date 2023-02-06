import parseECB from "../src/stabilitas/parseECB";

describe("ecb data", () => {
  it("ecb feed retuns data", async function () {
    var data = await parseECB();
    console.log("data", data);
  });
});
