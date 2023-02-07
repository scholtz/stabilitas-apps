from pyteal import *
import privateMethods.transfers as transfers
import base.router as router
import base.utils
import base.constants as constants

@router.router.method
def transfer(
    amount: abi.Uint64, 
    sender: abi.Account,
    receiver: abi.Address,
    asset: abi.Asset, 
    note: abi.String, 
  ) -> Expr:
    """
    Stabilitas DAO can transfer token from fees account
    """
    return Seq(
      base.utils.assert_sender_is_creator(),
      Assert(
        Or(
          sender.address() == App.globalGet(constants.c_global_address_lp_holder),
          sender.address() == App.globalGet(constants.c_global_address_protocol_fees_holder))),

      If(asset.asset_id() == Int(0),
        Assert(transfers.transferAlgo(amount, sender, receiver, note)),
        Assert(transfers.transferASA(amount, sender, receiver, asset, note)),
      ),
      Approve()
    )
