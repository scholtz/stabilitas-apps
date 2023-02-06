from pyteal import *
import base.utils

router = Router(
    name="StabilitasTokens",
    bare_calls=BareCallActions(
        # Allow this app to be created with a no-op call
        no_op=OnCompleteAction(action=Approve(), call_config=CallConfig.CREATE),
        # Allow standalone user opt in and close out
        opt_in=OnCompleteAction(action=Approve(), call_config=CallConfig.CALL),
        close_out=OnCompleteAction(action=Approve(), call_config=CallConfig.CALL),
        # only the creator can update or delete the app
        update_application=OnCompleteAction(
            action=base.utils.assert_sender_is_creator, call_config=CallConfig.CALL
        ),
        delete_application=OnCompleteAction(
            action=base.utils.assert_sender_is_creator, call_config=CallConfig.CALL
        ),
    ),
)
