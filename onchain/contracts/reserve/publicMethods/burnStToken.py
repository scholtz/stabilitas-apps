from pyteal import *
import privateMethods.transfers as transfers
import privateMethods.transfers as transfers
import calculation.calculation as calculation
import base.router as router
import base.constants as constants


@router.router.method
def burnStToken(
    depositToReserve: abi.Transaction, 
    addFee: abi.Account,
    #lpHolderAccount: abi.Address,
    oracleECB: abi.Application, 
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
    #tokensApp: abi.Application, 
    #appAMM: abi.Application,
    stAsset: abi.Asset, 
    claimAsset: abi.Asset, 
    #assetAMMLP: abi.Asset,
    depositStTokenAmount: abi.Uint64, 
    minimumToReceive: abi.Uint64
  ) -> Expr:
    """
    Deposit st token asset (stEUR) and pay the stable (USDc) to sender.

    Args:
        depositToReserve: The token deposit transaction of the stable token.
        lpHolderAccount: Accounting account for holding LP fees and LP positions
        oracleECB: Oracle providing prices from central bank
        oracleAMM1W: Oracle providing vwap prices timed weighted from AMM 1 week long
        oracleAMM1H: Oracle providing vwap prices timed weighted from AMM 1 hour long
        tokensApp: Tokens application with reserve st tokens
        appAMM: AMM pool application id
        stAsset: Reference to deposit asset (stCHF)
        claimAsset: Reference to asset to receive (USDc)
        assetAMMLP: LP token from AMM
        depositStTokenAmount: The amount deposited back to the st reserve
        minimumToReceive: Safeguard to protect the minimum amount received by minting
    """
    claimedReserveAmount = abi.make(abi.Uint64)
    return Seq(
        
        Assert(depositStTokenAmount.get() == depositToReserve.get().asset_amount()),
        Assert(depositToReserve.get().asset_receiver() == App.globalGet(constants.c_global_address_tokens_app)),
        Assert(stAsset.asset_id() == depositToReserve.get().xfer_asset()),
        Assert(claimAsset.asset_id() == App.globalGet(constants.c_global_asset_oracle_base)),

        # stAsset: abi.Asset, 
        # depositStTokenAmount: abi.Uint64, 
        # oracleECB: abi.Application,
        # oracleAMM1W: abi.Application,
        # oracleAMM1H: abi.Application,
        claimedReserveAmount.set(calculation.stableFromDepositOfStToken(stAsset,depositStTokenAmount, oracleECB, oracleAMM1W, oracleAMM1H)),
        # depositAsset: abi.Asset, 
        # depositAmount: abi.Uint64, 
        Assert(transfers.transferProtocolFeeToFeeAccount(addFee, claimAsset, claimedReserveAmount)),
        # tokensApp: abi.Application, 
        # lpHolderAccount: abi.Address, 
        # depositAsset: abi.Asset, 
        # assetAMMLP: abi.Asset, 
        # depositAmount: abi.Uint64, 
        # claimAsset: abi.Asset, 
        # oracleECB: abi.Application,
        # oracleAMM1W: abi.Application,
        # oracleAMM1H: abi.Application,
        # appAMM: abi.Application
        #Assert(transfers.transferLPFeeAndIncreaseLiquidity(tokensApp,lpHolderAccount,claimAsset,assetAMMLP,claimedReserveAmount,stAsset,oracleECB,oracleAMM1W,oracleAMM1H,appAMM)),
        
        # depositAsset: abi.Asset, 
        # depositAmount: abi.Uint64, 
        Assert(transfers.transferExitFeeToFeeAccount(claimAsset, claimedReserveAmount)),

        # claimAsset: abi.Asset, 
        # depositAmount: abi.Uint64,
        # minimumToReceive: abi.Uint64
        Assert(transfers.transferReserveToUser(claimAsset,claimedReserveAmount,minimumToReceive)),

        Approve()
    )