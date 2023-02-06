from pyteal import *
import calculation.calculation as calculation
import base.constants as constants
import pact.addLiq as addLiq

@Subroutine(TealType.uint64)
def transferProtocolFeeToFeeAccount(
    addrFee: abi.Account,
    depositAsset: abi.Asset, 
    depositAmount: abi.Uint64, 
) -> Expr:
    amount = abi.make(abi.Uint64)
    return Seq(
      amount.set(calculation.protocolFee(depositAmount)),
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.AssetTransfer,
        TxnField.xfer_asset: depositAsset.asset_id(),
        TxnField.asset_amount: amount.get(),
        TxnField.asset_receiver: addrFee.address(),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Approve(),
    )

@Subroutine(TealType.uint64)
def transferExitFeeToFeeAccount(
    depositAsset: abi.Asset, 
    depositAmount: abi.Uint64, 
) -> Expr:
    amount = abi.make(abi.Uint64)
    return Seq(
      amount.set(calculation.exitFee(depositAmount)),
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.AssetTransfer,
        TxnField.xfer_asset: depositAsset.asset_id(),
        TxnField.asset_amount: amount.get(),
        TxnField.asset_receiver: App.globalGet(constants.c_global_address_protocol_fees_holder),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Approve(),
    )

@Subroutine(TealType.uint64)
def transferLPFeeAndIncreaseLiquidity(
    tokensApp: abi.Application, 
    lpHolderAccount: abi.Address, 
    depositAsset: abi.Asset, 
    assetAMMLP: abi.Asset, 
    depositAmount: abi.Uint64, 
    claimAsset: abi.Asset, 
    oracleECB: abi.Application,
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
    appAMM: abi.Application
) -> Expr:
    amount = abi.make(abi.Uint64)
    amountStAsset = abi.make(abi.Uint64)
    return Seq(
      amount.set(calculation.lpFee(depositAmount)),
      amountStAsset.set(amount.get() * calculation.weightedOraclePrice(claimAsset,oracleECB,oracleAMM1W,oracleAMM1H)),
      # tokensApp: abi.Application, 
      # receiver: abi.Address, 
      # asset: abi.Asset, 
      # amount: abi.Uint64, 
      Assert(transferFromTokensContractToAddress(tokensApp,lpHolderAccount,claimAsset,amountStAsset)),
      # sender: abi.Address,
      # assetA: abi.Asset, # usdc
      # assetB: abi.Asset, # algo
      # assetAMMLP: abi.Asset,
      # amountA: abi.Uint64,
      # amountB: abi.Uint64,
      # appAMM: abi.Application,
      Assert(addLiq.processAddLiquidity(lpHolderAccount,depositAsset,claimAsset,assetAMMLP,amount,amountStAsset,appAMM)),
      Approve(),
    )

@Subroutine(TealType.uint64)
def transferFromTokensContractToAddress(
    tokensApp: abi.Application, 
    receiver: abi.Address, 
    asset: abi.Asset, 
    amount: abi.Uint64, 
) -> Expr:
    note = abi.make(abi.String)
    return Seq(
      note.set(Bytes("")),
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.MethodCall(
        app_id=tokensApp.application_id(),
        method_signature="transfer(uint64,account,asset,string)void",
        args=[
            Itob(amount.get()),
            receiver.get(),
            asset.asset_id(),
            note.get()
        ],
        extra_fields={
          TxnField.fee: Int(0),
          TxnField.sender: Global.current_application_address()
        }
      ),
      InnerTxnBuilder.Submit(),
      Approve(),
    )
    
@Subroutine(TealType.uint64)
def transferStTokenToClient(
    tokensApp: abi.Application, 
    depositAmount: abi.Uint64, 
    claimAsset: abi.Asset, 
    oracleECB: abi.Application,
    oracleAMM1W: abi.Application,
    oracleAMM1H: abi.Application,
    minimumToReceive: abi.Uint64
) -> Expr:
    sender = abi.make(abi.Address)
    amount = abi.make(abi.Uint64)
    return Seq(
      # claimAsset: abi.Asset, 
      # depositAmount: abi.Uint64, 
      # oracleECB: abi.Application,
      # oracleAMM1W: abi.Application,
      # oracleAMM1H: abi.Application,
      amount.set(calculation.amountToMint(claimAsset,depositAmount,oracleECB,oracleAMM1W,oracleAMM1H)),
      Assert(minimumToReceive.get() <= amount.get()),

      sender.set(Txn.sender()),
      # tokensApp: abi.Application, 
      # receiver: abi.Address, 
      # asset: abi.Asset, 
      # amount: abi.Uint64, 
      Assert(transferFromTokensContractToAddress(tokensApp,sender,claimAsset,amount)),
      Approve(),
    )


@Subroutine(TealType.none)
def transferASABase(
    amount: abi.Uint64, 
    receiver: abi.Address,
    asset: abi.Asset, 
    note: abi.String, 
) -> Expr:
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.AssetTransfer,
        TxnField.asset_amount: amount.get(),
        TxnField.asset_receiver: receiver.get(),
        TxnField.xfer_asset: asset.asset_id(),
        TxnField.note: note.get(),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Approve(),
    )
    
@Subroutine(TealType.none)
def transferASA(
    amount: abi.Uint64, 
    sender: abi.Account,
    receiver: abi.Address,
    asset: abi.Asset, 
    note: abi.String, 
) -> Expr:
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.AssetTransfer,
        TxnField.sender: sender.address(),
        TxnField.asset_amount: amount.get(),
        TxnField.asset_receiver: receiver.get(),
        TxnField.xfer_asset: asset.asset_id(),
        TxnField.note: note.get(),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Approve(),
    )
    
@Subroutine(TealType.none)
def transferAlgo(
    amount: abi.Uint64, 
    sender: abi.Account,
    receiver: abi.Address,
    note: abi.String, 
) -> Expr:
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.Payment,
        TxnField.sender: sender.address(),
        TxnField.amount: amount.get(),
        TxnField.receiver: receiver.get(),
        TxnField.note: note.get(),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Approve(),
    )

@Subroutine(TealType.uint64)
def transferReserveToUser(
    claimAsset: abi.Asset, 
    depositAmount: abi.Uint64,
    minimumToReceive: abi.Uint64
) -> Expr:
    userBalance = abi.make(abi.Uint64)
    note = abi.make(abi.String)
    receiver = abi.make(abi.Address)
    return Seq(
      # stableAmount: abi.Uint64, 
      userBalance.set(calculation.reserveBalanceAfterFees(depositAmount)),
      note.set(Bytes("")),
      Assert(userBalance.get() >= minimumToReceive.get()),
      receiver.set(Txn.sender()),
      # amount: abi.Uint64, 
      # sender: abi.Address,
      # receiver: abi.Address,
      # asset: abi.Asset, 
      # note: abi.String, 
      transferASABase(userBalance, receiver, claimAsset, note),
      Approve(),
    )
