
import {makeChatState} from "../../../models/state/chat-state.js"
import {ChatPost, ChatStatus} from "../../../common/types/chat-concepts.js"

export function prepareChatClientsideLogic({state}: {
		state: ReturnType<typeof makeChatState>
	}) {
	return {
		async roomStatusChanged(room: string, status: ChatStatus) {
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
		async postsAdded(room: string, posts: ChatPost[]) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						posts: [
							...state.writable.cache.rooms[room]?.posts ?? [],
							...posts,
						]
					},
				},
			}
		},
		async postsRemoved(room: string, postIds: string[]) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						posts: (state.writable.cache.rooms[room]?.posts ?? [])
							.filter(post => !postIds.includes(post.postId))
					},
				},
			}
		},
		async roomCleared(room: string) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						posts: [],
					},
				},
			}
		},
		async usersMuted(userIds: string[]) {},
		async usersUnmuted(userIds: string[]) {},
	}
}
