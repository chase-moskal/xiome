
import {ops} from "../../../../framework/ops.js"
import {makeChatState} from "../state/chat-state.js"
import {ChatDraft, ChatServerside, ChatStatus} from "../../common/types/chat-concepts.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard-permissions.js"

export function makeChatRoom({label, serverside, state}: {
		label: string
		serverside: ChatServerside
		state: ReturnType<typeof makeChatState>
	}) {

	const getRoomCache = () => state.readable.cache.rooms[label]
	const getAccess = () => ops.value(state.readable.accessOp)

	return {
		get posts() {
			return getRoomCache()?.posts ?? []
		},
		get status() {
			return getRoomCache()?.status ?? ChatStatus.Offline
		},
		get muted() {
			return state.readable.cache.mutedUserIds
		},
		get weAreMuted() {
			const {user: {userId}} = getAccess()
			return state.readable.cache.mutedUserIds.includes(userId)
		},
		get weAreBanned() {
			const {permit: {privileges}} = getAccess()
			return privileges.includes(appPermissions.privileges["banned"])
		},

		setRoomStatus(status: ChatStatus) {
			serverside.chatServer.setRoomStatus(label, status)
		},
		post(draft: ChatDraft) {
			serverside.chatServer.post(label, draft)
		},
		remove(postIds: string[]) {
			serverside.chatServer.remove(label, postIds)
		},
		clear() {
			serverside.chatServer.clear(label)
		},
		mute(userId: string) {
			serverside.chatServer.mute([userId])
		},
		unmute(userId: string) {
			serverside.chatServer.unmute([userId])
		},
		unmuteAll() {
			serverside.chatServer.unmuteAll()
		},
	}
}
