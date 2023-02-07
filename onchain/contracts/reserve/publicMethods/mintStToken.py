from pyteal import *
import privateMethods.transfers as transfers
import base.router as router
import base.constants as constants

@router.router.method
def mintStToken(
    depositToReserve: abi.Transaction, 
    addrFee: abi.Account, 
    #lpHolderAccount: abi.Address,
    oracleECB: abi.Application, 
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
    tokensApp: abi.Application, 
    #appAMM: abi.Application,
    depositAsset: abi.Asset, 
    claimAsset: abi.Asset, 
    #assetAMMLP: abi.Asset,
    depositAmount: abi.Uint64, 
    minimumToReceive: abi.Uint64
  ) -> Expr:
    """
    Deposit stable asset (USDc) and mint national currency asset on algorand.

    Args:
        depositToReserve: The token deposit transaction of the stable token.
        lpHolderAccount: Accounting account for holding LP fees and LP positions
        oracleECB: Oracle providing prices from central bank
        oracleAMM1W: Oracle providing vwap prices timed weighted from AMM 1 week long
        oracleAMM1H: Oracle providing vwap prices timed weighted from AMM 1 hour long
        depositAsset: Reference to deposit asset
        claimAsset: Reference to asset to receive
        assetAMMLP: LP token from AMM
        depositAmount: The amount deposited to the reserve of stable token (USDc)
        minimumToReceive: Safeguard to protect the minimum amount received by minting
    """
    return Seq(
        Assert(depositToReserve.get().xfer_asset() == depositAsset.asset_id()),
        Assert(depositToReserve.get().asset_receiver() == Global.current_application_address()),
        Assert(App.globalGet(constants.c_global_address_protocol_fees_holder) == addrFee.address()),
        #Assert(lpHolderAccount.get() == App.globalGet(constants.c_global_address_lp_holder)),
        Assert(App.globalGet(constants.c_global_app_oracle_ecb) == oracleECB.application_id()),
        Assert(App.globalGet(constants.c_global_app_oracle_amm1w) == oracleAMM1W.application_id()),
        Assert(App.globalGet(constants.c_global_app_oracle_amm1h) == oracleAMM1H.application_id()),
        
        Assert(App.globalGet(constants.c_global_app_tokens) == tokensApp.application_id()),
        #Assert(appAMM.application_id() == App.globalGet(constants.c_global_app_amm)),
        Assert(App.globalGet(constants.c_global_asset_oracle_base) == depositAsset.asset_id()),
        #Assert(assetAMMLP.asset_id() == App.globalGet(constants.c_global_asset_amm_lp)),
        Assert(depositAmount.get() == depositToReserve.get().asset_amount()),
        
        # depositAsset: abi.Asset, 
        # depositAmount: abi.Uint64, 
        Assert(transfers.transferProtocolFeeToFeeAccount(addrFee, depositAsset, depositAmount)),
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
        #Assert(transfers.transferLPFeeAndIncreaseLiquidity(tokensApp,lpHolderAccount,depositAsset,assetAMMLP,depositAmount,claimAsset,oracleECB,oracleAMM1W,oracleAMM1H,appAMM)),
        
        # tokensApp: abi.Application, 
        # depositAmount: abi.Uint64, 
        # claimAsset: abi.Asset, 
        # oracleECB: abi.Application,
        # oracleAMM1W: abi.Application,
        # oracleAMM1H: abi.Application,
        # minimumToReceive: abi.Uint64

        Assert(transfers.transferStTokenToClient(tokensApp,depositAmount,claimAsset,oracleECB,oracleAMM1W,oracleAMM1H,minimumToReceive)),
        Approve()
    )

