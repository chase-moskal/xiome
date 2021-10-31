
import {Op, ops} from "../../../framework/ops.js"
import {onesie} from "../../../toolbox/onesie.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {ChatClient, ChatMessage, ChatStatus, ConnectChatClient} from "../common/types/chat-concepts.js"

const maximumMessagesCachedPerChat = 100

export function makeChatModel({connectChatClient}: {
		connectChatClient: ConnectChatClient
	}) {

	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		connectionOp: ops.none() as Op<ChatClient>,
		cache: ops.none() as Op<{
			mutedUserIds: string[]
			chats: {[key: string]: {
				status: ChatStatus
				messages: ChatMessage[]
			}}
		}>
	})

	function forceUpdateCacheSoComponentsRerender() {
		state.writable.cache = {...state.writable.cache}
	}

	const reconnect = onesie(async function() {
		await ops.operation({
			setOp: op => state.writable.connectionOp = op,
			promise: connectChatClient({
				handlers: {
					async chatStatusChange(chat, status) {},
					async populateNewMessages(chat, messages) {},
					async deleteMessages(chat, messageIds) {},
					async muteUsers(userIds) {},
				},
			}),
		})
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			await reconnect()
		},
	}
}
