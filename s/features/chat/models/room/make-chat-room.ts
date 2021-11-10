
import {ops} from "../../../../framework/ops.js"
import {makeChatState} from "../state/chat-state.js"
import {ChatDraft, ChatServersideLogic, ChatStatus} from "../../common/types/chat-concepts.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard-permissions.js"

export function makeChatRoom({label, serverRemote, state}: {
		label: string
		serverRemote: ChatServersideLogic
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
			return state.readable.cache.mutedUserIds
				.find(mutedUserId => mutedUserId === userId)
		},
		get weAreBanned() {
			const {permit: {privileges}} = getAccess()
			return privileges.includes(appPermissions.privileges["banned"])
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
		mute(userId: string) {},
		unmute(userId: string) {},
	}
}
