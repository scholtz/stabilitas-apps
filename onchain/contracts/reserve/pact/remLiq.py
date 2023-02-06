from pyteal import *
@Subroutine(TealType.uint64)
def processRemoveLiquidity(
      addrDeposit: abi.Address,
      addrAMMEscrow: abi.Address,
      appAMM: abi.Application, #main pact app
      assetA: abi.Asset, # usdc
      assetB: abi.Asset, # algo
      assetAMMLP: abi.Asset,
      amountLP: abi.Uint64,
) -> Expr:
    # https://testnet.algoexplorer.io/tx/group/tt536UMu5zNdB%2F5WdBYONPtoMyuEYrttQtz4SYtJnlQ%3D
    # https://testnet.algoexplorer.io/tx/REXA3RZFWSRDRYURNLPAN4DAIU4UTN55E3KGF2QFAXNIWUMLLULA
    # 
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.AssetTransfer,
        TxnField.asset_receiver: addrAMMEscrow.get(),
        TxnField.xfer_asset: assetAMMLP.asset_id(),
        TxnField.asset_amount: amountLP.get(),
        TxnField.fee: Int(0),
      }),
      InnerTxnBuilder.Next(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.ApplicationCall,
        TxnField.application_id: appAMM.application_id(),
        TxnField.application_args: [
          Bytes("REMLIQ"),
          # TODO .. check what is this
          Bytes("base16", "0000000000000000"),
          Bytes("base16", "0000000000000000"),
        ],
        TxnField.assets: [
          assetB.asset_id(), 
          assetA.asset_id() 
        ],
        TxnField.fee: Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Approve()
    )