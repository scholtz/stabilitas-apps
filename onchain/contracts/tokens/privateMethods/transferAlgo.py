from pyteal import *

@Subroutine(TealType.uint64)
def transferAlgo(
    amount: abi.Uint64, 
    receiver: abi.Account,
    note: abi.String, 
) -> Expr:
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.Payment,
        TxnField.amount: amount.get(),
        TxnField.receiver: receiver.address(),
        TxnField.note: note.get(),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      Return(Int(1))
    )
    