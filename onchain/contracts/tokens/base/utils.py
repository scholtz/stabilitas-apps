from pyteal import *

@Subroutine(TealType.none)
def assert_sender_is_creator() -> Expr:
    return Assert(Txn.sender() == Global.creator_address())
