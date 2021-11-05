
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {snapstate} from "../../../../toolbox/snapstate/snapstate.js"
import {ChatCache, ChatConnection} from "../../common/types/chat-concepts.js"

export function makeChatState() {
	return snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		connectionOp: ops.none() as Op<ChatConnection>,
		cache: <ChatCache>{
			mutedUserIds: [],
			rooms: {},
		},
	})
}
