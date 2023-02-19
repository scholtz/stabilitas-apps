import VWAPDB from "../interface/VWAPDB";

const timeWeightedVWAP = (blockData: VWAPDB, roundToProcess: number, oldRound: number) => {
  let sumPrice = 0;
  let sumVolume = 0;
  let weight = 0;
  for (let round = oldRound; round <= roundToProcess; round++) {
    weight++;
    if (round in blockData) {
      sumPrice += blockData[round].price * blockData[round].volume * weight;
      sumVolume += blockData[round].volume * weight;
    }
  }
  console.log("sumPrice, sumVolume", sumPrice, sumVolume);
  if (sumVolume == 0) return 0;
  return sumPrice / sumVolume;
};
export default timeWeightedVWAP;
