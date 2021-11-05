
import {makeChatState} from "../../models/state/chat-state.js"
import {ChatClientHandlers} from "../../common/types/chat-concepts.js"

export function prepareChatClientsideLogic({state}: {
		state: ReturnType<typeof makeChatState>
	}): ChatClientHandlers {
	return {
		async roomStatus(room, status) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						status,
					},
				},
			}
		},
		async posted(room, messages) {},
		async deleted(room, messageIds) {},
		async cleared(room) {},
		async muted(userIds) {},
	}
}
