
import {LingoShape} from "../../../../toolbox/lingo/lingo.js"
import {ChatClientHandlers} from "../../common/types/chat-concepts.js"

export const chatClientsideShape:
		LingoShape<ChatClientHandlers> = {
	roomStatus: true,
	posted: true,
	deleted: true,
	cleared: true,
	muted: true,
}
