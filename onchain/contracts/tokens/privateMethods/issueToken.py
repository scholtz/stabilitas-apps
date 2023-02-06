from pyteal import *

@Subroutine(TealType.uint64)
def issueToken(
    name: abi.String, 
    unit: abi.String, 
    url: abi.String, 
    hash: abi.String,
    freeze: abi.Address,
    clawback: abi.Address,
) -> Expr:
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.AssetConfig,
        TxnField.config_asset_name: name.get(),
        TxnField.config_asset_unit_name: unit.get(),
        TxnField.config_asset_decimals: Int(6),
        TxnField.config_asset_url: url.get(),
        TxnField.config_asset_metadata_hash: hash.get(),
        TxnField.config_asset_total: Int(18_446_744_073_709_000_000),
        TxnField.config_asset_reserve: Global.current_application_address(),
        TxnField.config_asset_freeze: freeze.get(),
        TxnField.config_asset_clawback: clawback.get(),
        TxnField.fee : Int(0),
      }),
      InnerTxnBuilder.Submit(),
      App.globalPut(name.get(), InnerTxn.created_asset_id()),
      Approve(),
    )
    