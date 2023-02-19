const getPriceAndVolumeFromPactTxn = (stxn: any, appAMM: number, primarySide: string, primaryAsset: number) => {
  let retPrice = 0;
  let retVolume = 0;
  if (stxn.txn.apid == appAMM) {
    console.log("stxn", stxn);
    console.log("stxn.dt.itx", stxn.dt.itx);
    console.log("stxn.dt.gd", stxn.dt.gd);
    let price = stxn.dt.gd.A.ui / stxn.dt.gd.B.ui;
    if (primarySide == "B") {
      price = stxn.dt.gd.B.ui / stxn.dt.gd.A.ui;
    }
    let volume = 0;
    if (stxn.dt.itx[0].txn.xaid) {
      if (stxn.dt.itx[0].txn.xaid == primaryAsset) {
        // primary asset
        volume = stxn.dt.itx[0].txn.aamt / price;
      } else {
        volume = stxn.dt.itx[0].txn.aamt * price;
      }
    } else {
      if (0 == primaryAsset) {
        // primary asset
        volume = stxn.dt.itx[0].txn.amt / price;
      } else {
        volume = stxn.dt.itx[0].txn.amt * price;
      }
    }
    console.log("price after swap", price, volume);

    retPrice = (retPrice * retVolume + price * volume) / (retVolume + volume);
    retVolume = retVolume + volume;
  }
  if (stxn && stxn.dt && stxn.dt.itx) {
    stxn.dt.itx.forEach((txn) => {
      var ret = getPriceAndVolumeFromPactTxn(txn, appAMM, primarySide, primaryAsset);
      if (ret.volume > 0) {
        retPrice = (retPrice * retVolume + ret.price * ret.volume) / (retVolume + ret.volume);
        retVolume = retVolume + ret.volume;
      }
    });
  }
  return { price: retPrice, volume: retVolume };
};
export default getPriceAndVolumeFromPactTxn;
