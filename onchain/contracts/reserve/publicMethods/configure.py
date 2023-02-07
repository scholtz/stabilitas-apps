from pyteal import *
import privateMethods.transfers as transfers
import base.router as router
import base.constants as constants
import base.utils as utils

# from pyteal import *

# c_global_protocol_fee = Bytes("pf")
# c_global_lp_fee = Bytes("lpf")
# c_global_negative_fee = Bytes("nf")
# c_global_exit_fee = Bytes("ef")

# c_global_stop_price_top = Bytes("spt")
# c_global_stop_price_low = Bytes("spl")

# c_global_address_protocol_fees_holder = Bytes("af")
# c_global_address_lp_holder = Bytes("alpf")
# c_global_address_tokens_app = Bytes("ata")

# c_global_app_amm = Bytes("aa")
# c_global_app_tokens = Bytes("at")
# c_global_asset_amm_lp = Bytes("alp")

@router.router.method
def configureVariables(
    addrFee: abi.Account , 
    #addrLPFee: abi.Address , 
    addrTokensApp: abi.Address,
    #appAMM: abi.Application,
    appTokens: abi.Application,
    #assetAMMLP: abi.Asset,
    assetOracleBase: abi.Asset,
    protocolFee: abi.Uint64, 
    lpFee: abi.Uint64, 
    negativeFee: abi.Uint64, 
    exitFee: abi.Uint64, 
    stopPriceTop: abi.Uint64, 
    stopPriceLow: abi.Uint64 , 
  ) -> Expr:
    """
    Stabilitas DAO can configure the base variables

    Args:
        protocolFee: Protocol fee in base 10000
        lpFee: Protocol LP fee in base 10000
        negativeFee: Protocol negative fee in base 10000
        exitFee: Protocol exit fee in base 10000
        stopPriceTop: Stop price top in base 10000
        stopPriceLow: Stop price low in base 10000
    """
    
    zero = abi.make(abi.Uint64)
    emptyStr = abi.make(abi.String)
    receiver = abi.make(abi.Address)
    receiverApp = abi.make(abi.Address)
    return Seq(
        utils.assert_sender_is_creator(),
        App.globalPut(constants.c_global_protocol_fee, protocolFee.get()),
        App.globalPut(constants.c_global_lp_fee, lpFee.get()),
        App.globalPut(constants.c_global_negative_fee, negativeFee.get()),
        App.globalPut(constants.c_global_exit_fee, exitFee.get()),
        App.globalPut(constants.c_global_stop_price_top, stopPriceTop.get()),
        App.globalPut(constants.c_global_stop_price_low, stopPriceLow.get()),
        
        App.globalPut(constants.c_global_address_protocol_fees_holder, addrFee.address()),
        #App.globalPut(constants.c_global_address_lp_holder, addrLPFee.get()),
        App.globalPut(constants.c_global_address_tokens_app, addrTokensApp.get()),

        
        #App.globalPut(constants.c_global_app_amm, appAMM.application_id()),
        App.globalPut(constants.c_global_app_tokens, appTokens.application_id()),

        #App.globalPut(constants.c_global_asset_amm_lp, assetAMMLP.asset_id()),

        zero.set(Int(0)),
        emptyStr.set(Bytes("")),
        receiver.set(addrFee.address()),
        receiverApp.set(Global.current_application_address()),
        # amount: abi.Uint64, 
        # sender: abi.Address,
        # receiver: abi.Address,
        # asset: abi.Asset, 
        # note: abi.String, 
        
        Assert(transfers.transferASABase(zero,receiverApp,assetOracleBase,emptyStr)),
        Assert(transfers.transferASA(zero,addrFee,receiver,assetOracleBase,emptyStr)), # opt in to usdc to receive fees
        #transfers.transferASA(zero,addrLPFee,addrLPFee,assetOracleBase,emptyStr), # opt in to usdc to receive lp fees
        #transfers.transferASA(zero,addrLPFee,addrLPFee,assetAMMLP,emptyStr),# opt in to lp asset to receive lp position
    )


# c_global_app_oracle_ecb = Bytes("o1")
# c_global_app_oracle_amm1w = Bytes("o2")
# c_global_app_oracle_amm1h = Bytes("o3")

# c_global_oracle_ecb_weight = Bytes("o1w")
# c_global_oracle_amm1w_weight = Bytes("o2w")
# c_global_oracle_amm1h_weight = Bytes("o3w")

# c_global_asset_oracle_base = Bytes("ot")


@router.router.method
def configureOracles(
    o1: abi.Application, 
    o1w: abi.Uint64, 
    o2: abi.Application, 
    o2w: abi.Uint64, 
    o3: abi.Application, 
    o3w: abi.Uint64, 
    assetOracleBase: abi.Asset,
  ) -> Expr:
    """
    Stabilitas DAO can configure the base variables

    Args:
        o1: Oracle 1 feed - ECB data
        o1w: Weight of oracle 1 o1w+o2w+o3w==10000
        o2: Oracle 2 feed - Time weighted VWAP from AMM 1W
        o2w: Weight of oracle 1 o1w+o2w+o3w==10000
        o3: Oracle 3 feed - Time weighted VWAP from AMM 1H
        o3w: Weight of oracle 1 o1w+o2w+o3w==10000
    """
    return Seq(
        utils.assert_sender_is_creator(),
        Assert(o1w.get() + o2w.get() + o3w.get() == Int(10000)),
        App.globalPut(constants.c_global_app_oracle_ecb, o1.application_id()),
        App.globalPut(constants.c_global_app_oracle_amm1w, o2.application_id()),
        App.globalPut(constants.c_global_app_oracle_amm1h, o3.application_id()),
        App.globalPut(constants.c_global_oracle_ecb_weight, o1w.get()),
        App.globalPut(constants.c_global_oracle_amm1w_weight, o2w.get()),
        App.globalPut(constants.c_global_oracle_amm1h_weight, o3w.get()),

        App.globalPut(constants.c_global_asset_oracle_base, assetOracleBase.asset_id()),
        Approve()
    )