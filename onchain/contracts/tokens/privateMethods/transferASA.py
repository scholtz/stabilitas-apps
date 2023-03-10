from pyteal import *

@Subroutine(TealType.uint64)
def transferASA(
    amount: abi.Uint64, 
    receiver: abi.Account,
    asset: abi.Asset, 
    note: abi.String, 
) -> Expr:
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.AssetTransfer,
        TxnField.asset_amount: amount.get(),
        TxnField.asset_receiver: receiver.address(),
        TxnField.xfer_asset: asset.asset_id(),
        TxnField.note: note.get(),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Return(Int(1))
    )
    