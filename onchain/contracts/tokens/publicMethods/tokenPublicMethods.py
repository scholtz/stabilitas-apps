from pyteal import *
import privateMethods.transferAlgo as transferAlgo
import privateMethods.transferASA as transferASA
import privateMethods.issueToken as deployIssueToken
import base.constants as constants
import base.router as router
import base.utils

@router.router.method
def issueToken(
    name: abi.String, 
    unit: abi.String, 
    url: abi.String, 
    hash: abi.String,
    freeze: abi.Address,
    clawback: abi.Address,
  ) -> Expr:
    """
    Stabilitas DAO can issue new token
    """
    return Seq(
      base.utils.assert_sender_is_creator(),
      Assert(deployIssueToken.issueToken(
        name, 
        unit, 
        url, 
        hash,
        freeze,
        clawback
      )),
      Approve()
    )

@router.router.method
def setReserveContract(
    reserveApp: abi.Application
  ) -> Expr:
    """
    Stabilitas DAO can set the reserve App. Reserve app can call transfer tokens.
    """
    return Seq(
      base.utils.assert_sender_is_creator(),
      addr:=AppParam.address(reserveApp.application_id()),
      Assert(addr.hasValue()),
      App.globalPut(constants.c_global_reserve_app_id, reserveApp.application_id()),
      App.globalPut(constants.c_global_reserve_addr, addr.value()),
      Approve()
    )


@router.router.method
def transfer(
    amount: abi.Uint64, 
    receiver: abi.Address,
    asset: abi.Asset, 
    note: abi.String, 
  ) -> Expr:
    """
    Stabilitas DAO can transfer token to smart contract
    """
    return Seq(
        
      Assert(Or(
        Txn.sender() == Global.creator_address(),  # DAO executives using multisig can execute the transfers
        Txn.sender() == App.globalGet(constants.c_global_reserve_addr) # reserve app can execute the transfers
      )),
      If(asset.asset_id() == Int(0),
        Assert(transferAlgo.transferAlgo(amount, receiver, note)),
        Assert(transferASA.transferASA(amount, receiver, asset, note)),
      ),
      Approve()
    )
