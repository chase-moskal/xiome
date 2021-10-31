
import {AsHandlers} from "../../../../toolbox/lingo/lingo.js"
import {prepareClientsideHandlers} from "./prepare-clientside-handlers.js"
import {ChatAuth, ChatDatabase, ChatMessage} from "../../common/types/chat-concepts.js"

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

		async postMessage(message: ChatMessage) {},
	}
}
