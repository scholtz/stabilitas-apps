from pyteal import *

c_global_protocol_fee = Bytes("pf")
c_global_lp_fee = Bytes("lpf")
c_global_negative_fee = Bytes("nf")
c_global_exit_fee = Bytes("ef")

c_global_stop_price_top = Bytes("spt")
c_global_stop_price_low = Bytes("spl")

c_global_app_oracle_ecb = Bytes("o1")
c_global_app_oracle_amm1w = Bytes("o2")
c_global_app_oracle_amm1h = Bytes("o3")

c_global_oracle_ecb_weight = Bytes("o1w")
c_global_oracle_amm1w_weight = Bytes("o2w")
c_global_oracle_amm1h_weight = Bytes("o3w")

c_global_address_protocol_fees_holder = Bytes("af")
c_global_address_lp_holder = Bytes("alpf")
c_global_address_tokens_app = Bytes("ata")

c_global_app_amm = Bytes("aa")
c_global_app_tokens = Bytes("at")

c_global_asset_oracle_base = Bytes("ot")
c_global_asset_amm_lp = Bytes("alp")

