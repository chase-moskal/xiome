
import {AsHandlers, LingoShape} from "../../../../toolbox/lingo/lingo.js"
import {ChatAuth, ChatDatabase, ChatMessageDraft, ClientsideHandlers} from "../../common/types/chat-concepts.js"

export function prepareServersideHandlers({
			database,
			clientside,
			getAuth,
		}: {
			database: ChatDatabase
			clientside: AsHandlers<ClientsideHandlers>
			getAuth(): ChatAuth
		}) {
	return {
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
	subscribeForChat: true,
	unsubscribeForChat: true,
	postMessage: true,
	deleteMessages: true,
	clearAllMessages: true,
	muteUsers: true,
}
