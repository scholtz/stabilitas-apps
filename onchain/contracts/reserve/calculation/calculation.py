from pyteal import *
import base.constants as constants

@Subroutine(TealType.uint64)
def protocolFee(
    depositAmount: abi.Uint64, 
) -> Expr:
    return Seq(
        Return(App.globalGet(constants.c_global_protocol_fee)*depositAmount.get()/Int(10000))
    )

@Subroutine(TealType.uint64)
def lpFee(
    depositAmount: abi.Uint64, 
) -> Expr:
    amountAfterFee = abi.make(abi.Uint64)
    return Seq(
        amountAfterFee.set(depositAmount.get() - protocolFee(depositAmount)),
        Return(App.globalGet(constants.c_global_lp_fee)*amountAfterFee.get()/Int(10000))
    )

@Subroutine(TealType.uint64)
def exitFee(
    stableAmount: abi.Uint64, 
) -> Expr:
    amountAfterFee = abi.make(abi.Uint64)
    return Seq(
        amountAfterFee.set(stableAmount.get() - protocolFee(stableAmount) - lpFee(stableAmount)),
        Return(App.globalGet(constants.c_global_exit_fee)*amountAfterFee.get()/Int(10000))
    )
        
@Subroutine(TealType.uint64)
def reserveBalanceAfterFees(
    stableAmount: abi.Uint64, 
) -> Expr:
    return Seq(
        Return(stableAmount.get() - protocolFee(stableAmount) - lpFee(stableAmount) - exitFee(stableAmount)),
    )
        
@Subroutine(TealType.uint64)
def getOraclePrice(
    oracle: abi.Application, 
    asset: abi.Asset, 
) -> Expr:
    return Seq(
        price:=App.globalGetEx(oracle.application_id(), Itob(asset.asset_id())),
        Assert(price.hasValue()),
        Return(Btoi(Substring(price.value(),Int(0),Int(8))))
    )

@Subroutine(TealType.uint64)
def weightedOraclePrice(
    claimAsset: abi.Asset, 
    oracleECB: abi.Application,
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
) -> Expr:
    return Seq(
      Return(
        getOraclePrice(oracleECB,claimAsset)*App.globalGet(constants.c_global_oracle_ecb_weight)/Int(10000)+
        getOraclePrice(oracleAMM1W,claimAsset)*App.globalGet(constants.c_global_oracle_amm1w_weight)/Int(10000)+
        getOraclePrice(oracleAMM1H,claimAsset)*App.globalGet(constants.c_global_oracle_amm1h_weight)/Int(10000)
      )
    )

@Subroutine(TealType.uint64)
def amountToMint(
    #depositAsset: abi.Asset,  # to check if we deposit the oracle base asset
    claimAsset: abi.Asset, 
    depositAmount: abi.Uint64, 
    oracleECB: abi.Application,
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
) -> Expr:
    fee = abi.make(abi.Uint64)
    lp = abi.make(abi.Uint64)
    amountAfterFees = abi.make(abi.Uint64)
    weightedPrice = abi.make(abi.Uint64)
    return Seq(
      fee.set(protocolFee(depositAmount)),
      lp.set(lpFee(depositAmount)),
      amountAfterFees.set(depositAmount.get() - fee.get() - lp.get()),
      weightedPrice.set(amountAfterFees.get() * weightedOraclePrice(claimAsset,oracleECB,oracleAMM1W,oracleAMM1H)/Int(10000000)),
      Return(weightedPrice.get())
    )

@Subroutine(TealType.uint64)
def stableFromDepositOfStToken(
    stAsset: abi.Asset, 
    depositStTokenAmount: abi.Uint64, 
    oracleECB: abi.Application,
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
) -> Expr:
    return Seq(
      Return(depositStTokenAmount.get() * Int(10000000) / weightedOraclePrice(stAsset,oracleECB,oracleAMM1W,oracleAMM1H))
    )
    