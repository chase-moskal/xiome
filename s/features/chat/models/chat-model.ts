
import {Op, ops} from "../../../framework/ops.js"
import {onesie} from "../../../toolbox/onesie.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {ChatClient, ChatMessage, ChatMeta, ChatStatus, ConnectChatClient} from "../common/types/chat-concepts.js"

const maximumMessagesCachedPerChat = 100

export function makeChatModel({connectChatClient, getChatMeta}: {
		connectChatClient: ConnectChatClient
		getChatMeta: () => Promise<ChatMeta>
	}) {

	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		clientOp: ops.none() as Op<ChatClient>,
		cache: ops.none() as Op<{
			mutedUserIds: string[]
			chats: {[key: string]: {
				status: ChatStatus
				messages: ChatMessage[]
			}}
		}>
	})

	const reconnect = onesie(async function() {
		if (ops.isReady(state.readable.clientOp)) {
			const client = ops.value(state.readable.clientOp)
			await client.disconnect()
		}
		await ops.operation({
			setOp: op => state.writable.clientOp = op,
			promise: connectChatClient({
				handlers: {
					async chatStatusChange(chat, status) {},
					async populateNewMessages(chat, messages) {},
					async deleteMessages(chat, messageIds) {},
					async muteUsers(userIds) {},
				},
			}).then(async client => {
				const meta = await getChatMeta()
				await client.updateUserMeta(meta)
				return client
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
