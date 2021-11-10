
import {makeChatState} from "../state/chat-state.js"
import {ChatDraft, ChatServersideLogic, ChatStatus} from "../../common/types/chat-concepts.js"

export function makeChatRoom({label, serverRemote, state}: {
		label: string
		serverRemote: ChatServersideLogic
		state: ReturnType<typeof makeChatState>
	}) {

	const getRoomCache = () => state.readable.cache.rooms[label]

	return {
		get posts() {
			return getRoomCache()?.posts ?? []
		},
		get status() {
			return getRoomCache()?.status ?? ChatStatus.Offline
		},
		setRoomStatus(status: ChatStatus) {
			serverRemote.setRoomStatus(label, status)
		},
		post(draft: ChatDraft) {
			serverRemote.post(label, draft)
		},
		remove(postIds: string[]) {
			serverRemote.remove(label, postIds)
		},
		clear() {
			serverRemote.clear(label)
		},
	}
}
