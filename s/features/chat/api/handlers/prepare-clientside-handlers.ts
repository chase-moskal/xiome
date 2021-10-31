
import {ChatState, ChatMessage, LocalChatCache} from "../../common/types/chat-concepts.js"

export function prepareClientsideHandlers({cache}: {
			cache: LocalChatCache
		}) {
	return {

		async populateNewMessages(messages: ChatMessage[]) {
		},

		async chatStateChange(state: ChatState) {
		},
	}
}
