
import {AsHandlers, LingoShape} from "../../../../toolbox/lingo/lingo.js"
import {prepareClientsideHandlers} from "./prepare-clientside-handlers.js"
import {ChatAuth, ChatDatabase, ChatMessageDraft} from "../../common/types/chat-concepts.js"

export function prepareServersideHandlers({
			auth,
			database,
			clientside,
		}: {
			auth: ChatAuth
			database: ChatDatabase
			clientside: AsHandlers<ReturnType<typeof prepareClientsideHandlers>>
		}) {
	return {
		async postMessage(draft: ChatMessageDraft) {},
		async deleteMessage(messageId: string) {},
		async clearMessages() {},
	}
}

export const serversideShape:
		LingoShape<ReturnType<typeof prepareServersideHandlers>> = {
	postMessage: true,
	deleteMessage: true,
	clearMessages: true,
}
