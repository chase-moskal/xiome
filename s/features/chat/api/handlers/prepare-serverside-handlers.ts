
import {AsHandlers, LingoShape} from "../../../../toolbox/lingo/lingo.js"
import {ChatAuth, ChatDatabase, ChatMessageDraft, ChatMeta, ChatPolicy, ClientsideHandlers} from "../../common/types/chat-concepts.js"

export function prepareServersideHandlers({
			database,
			clientside,
			policy,
		}: {
			database: ChatDatabase
			clientside: AsHandlers<ClientsideHandlers>
			policy: ChatPolicy
		}) {
	let auth: ChatAuth
	return {
		async updateUserMeta(meta: ChatMeta) {
			auth = await policy(meta)
		},
		async subscribeForChat(chat: string) {},
		async unsubscribeForChat(chat: string) {},
		async postMessage(chat: string, draft: ChatMessageDraft) {},
		async deleteMessages(chat: string, messageIds: string[]) {},
		async clearAllMessages(chat: string) {},
		async muteUsers(userIds: string[]) {},
	}
}

export const serversideShape:
		LingoShape<ReturnType<typeof prepareServersideHandlers>> = {
	updateUserMeta: true,
	subscribeForChat: true,
	unsubscribeForChat: true,
	postMessage: true,
	deleteMessages: true,
	clearAllMessages: true,
	muteUsers: true,
}
