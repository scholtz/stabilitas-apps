from pyteal import *
import json
import base.router as router

import publicMethods.configure
import publicMethods.mintStToken
import publicMethods.burnStToken
import publicMethods.transfer

approval_program, clear_state_program, contract = router.router.compile_program(
    version=8, optimize=OptimizeOptions(scratch_slots=True)
)

if __name__ == "__main__":
    with open("onchain/build/Reserve.teal", "w") as f:
        f.write(approval_program)

    with open("onchain/build/ReserveClear.teal", "w") as f:
        f.write(clear_state_program)

    with open("abi/stabilitas/Reserve.json", "w") as f:
        f.write(json.dumps(contract.dictify(), indent=4))