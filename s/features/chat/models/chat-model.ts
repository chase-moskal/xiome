
import {Op, ops} from "../../../framework/ops.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {ConnectChatClient} from "../common/types/chat-concepts.js"

export function makeChatModel({connectChatClient}: {
		connectChatClient: ConnectChatClient
	}) {

	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
		},
	}
}
