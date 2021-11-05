
import {makeChatState} from "../../models/state/chat-state.js"
import {ChatPost, ChatStatus} from "../../common/types/chat-concepts.js"

export function prepareChatClientsideLogic({state}: {
		state: ReturnType<typeof makeChatState>
	}) {
	return {
		async roomStatus(room: string, status: ChatStatus) {
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
		async posted(room: string, posts: ChatPost[]) {},
		async deleted(room: string, postIds: string[]) {},
		async cleared(room: string) {},
		async muted(userIds: string[]) {},
	}
}
