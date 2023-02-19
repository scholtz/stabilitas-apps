import VWAPDB from "../src/interface/VWAPDB";
import timeWeightedVWAP from "../src/stabilitas/timeWeightedVWAP";

describe("test timeWeightedVWAP", () => {
  it("same price", async function () {
    const blockData: VWAPDB = {};
    const roundToProcess: number = 5;
    const oldRound: number = 1;

    blockData[1] = { price: 10, volume: 1 };
    blockData[5] = { price: 10, volume: 10 };

    // (10 * 1 + 11 * 2 + 12 * 3 + 13 *4 + 14 * 5 ) / (1+2+3+4+5) = 12,666666666666666666666666666667

    const tVWAP = await timeWeightedVWAP(blockData, roundToProcess, oldRound);
    expect(tVWAP).toBe(10);
  });
  it("10 to 14", async function () {
    const blockData: VWAPDB = {};
    const roundToProcess: number = 5;
    const oldRound: number = 1;

    blockData[1] = { price: 10, volume: 10 };
    blockData[2] = { price: 11, volume: 10 };
    blockData[3] = { price: 12, volume: 10 };
    blockData[4] = { price: 13, volume: 10 };
    blockData[5] = { price: 14, volume: 10 };

    // (10 * 1 + 11 * 2 + 12 * 3 + 13 *4 + 14 * 5 ) / (1+2+3+4+5) = 12,666666666666666666666666666667

    const tVWAP = await timeWeightedVWAP(blockData, roundToProcess, oldRound);
    expect(tVWAP).toBe(12.666666666666666);
  });
  it("volume change", async function () {
    const blockData: VWAPDB = {};
    const roundToProcess: number = 5;
    const oldRound: number = 1;

    blockData[1] = { price: 10, volume: 10 };
    blockData[5] = { price: 40, volume: 1 };

    // (10 * 1 * 10 + 40 * 5 * 1 ) / (1*10+5*1) = 11,333333333333333333333333333333

    const tVWAP = await timeWeightedVWAP(blockData, roundToProcess, oldRound);
    expect(tVWAP).toBe(20);
  });
});
