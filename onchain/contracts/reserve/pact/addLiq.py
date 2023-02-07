from pyteal import *
@Subroutine(TealType.uint64)
def processAddLiquidity(
      sender: abi.Address,
      assetA: abi.Asset, # usdc
      assetB: abi.Asset, # algo
      assetAMMLP: abi.Asset,
      amountA: abi.Uint64,
      amountB: abi.Uint64,
      appAMM: abi.Application, #main pact app
) -> Expr:
    return Seq(
      If(amountA.get() == Int(0), Return(Int(1))),# if amount a or b is 0, do not do app call
      If(amountB.get() == Int(0), Return(Int(1))),
      addrAMMEscrow:=AppParam.address(appAMM.application_id()),
      Assert(addrAMMEscrow.hasValue()),
      InnerTxnBuilder.Begin(),
      If(assetB.asset_id() == Int(0),
        InnerTxnBuilder.SetFields({
          TxnField.sender: sender.get(),
          TxnField.type_enum: TxnType.Payment,
          TxnField.receiver: addrAMMEscrow.value(),
          TxnField.amount: amountB.get(),
          TxnField.fee: Int(0),
        })
        ,# else
        InnerTxnBuilder.SetFields({
          TxnField.sender: sender.get(),
          TxnField.type_enum: TxnType.AssetTransfer,
          TxnField.asset_receiver: addrAMMEscrow.value(),
          TxnField.asset_amount: amountB.get(),
          TxnField.xfer_asset: assetB.asset_id(),
          TxnField.fee: Int(0),
        })
      ),
      InnerTxnBuilder.Next(),
      If(assetA.asset_id() == Int(0),
        InnerTxnBuilder.SetFields({
          TxnField.sender: sender.get(),
          TxnField.type_enum: TxnType.Payment,
          TxnField.receiver: addrAMMEscrow.value(),
          TxnField.amount: amountA.get(),
          TxnField.fee: Int(0),
        })
        ,# else
        InnerTxnBuilder.SetFields({
          TxnField.sender: sender.get(),
          TxnField.type_enum: TxnType.AssetTransfer,
          TxnField.asset_receiver: addrAMMEscrow.value(),
          TxnField.xfer_asset: assetA.asset_id(),
          TxnField.asset_amount: amountA.get(),
          TxnField.fee: Int(0),
        }),
      ),
      InnerTxnBuilder.Next(),
      InnerTxnBuilder.SetFields({
        TxnField.sender: sender.get(),
        TxnField.type_enum: TxnType.ApplicationCall,
        TxnField.application_id: appAMM.application_id(),
        TxnField.application_args: [
          Bytes("ADDLIQ"),
          # TODO .. check what is this
          Bytes("base16", "0000000000000000"),
        ],
        TxnField.assets: [
          assetB.asset_id(), 
          assetA.asset_id(), 
          assetAMMLP.asset_id()
        ],
        TxnField.fee: Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Return(Int(1))
    )