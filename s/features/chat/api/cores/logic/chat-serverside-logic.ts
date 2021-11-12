
import {Rando} from "../../../../../toolbox/get-rando.js"
import {objectMap} from "../../../../../toolbox/object-map.js"
import {chatAllowance} from "../../../common/chat-allowance.js"
import {ChatDraft, ChatMeta, ChatPersistence, ChatPolicy, ChatPost, ChatStatus, ClientRecord} from "../../../common/types/chat-concepts.js"

export function prepareChatServersideLogic({
			rando,
			persistence,
			clientRecord,
			policy,
		}: {
			rando: Rando
			clientRecord: ClientRecord
			persistence: ChatPersistence
			policy: ChatPolicy
		}) {

	const {clientRemote} = clientRecord
	const getAllowance = () => chatAllowance(
		clientRecord.auth?.access.permit.privileges ?? []
	)
	const isNotMuted = () => !persistence.isMuted(
		clientRecord.auth.access.user.userId,
	)
	const isNotBanned = () => !getAllowance().banned

	return {
		async updateUserMeta(meta: ChatMeta) {
			clientRecord.auth = await policy(meta)
		},
		async roomSubscribe(room: string) {
			if (!getAllowance().viewAllChats)
				return undefined
			clientRecord.rooms.add(room)
			clientRemote.roomStatusChanged(room, await persistence.getRoomStatus(room))
		},
		async roomUnsubscribe(room: string) {
			if (!getAllowance().viewAllChats)
				return undefined
			clientRecord.rooms.delete(room)
		},
		async post(room: string, draft: ChatDraft) {
			if (!getAllowance().participateInAllChats)
				return undefined
			if (isNotMuted() && isNotBanned()) {
				const post: ChatPost = {
					...draft,
					room,
					time: Date.now(),
					postId: rando.randomId().toString(),
					userId: clientRecord.auth.access.user.userId,
					nickname: clientRecord.auth.access.user.profile.nickname,
				}
				await persistence.addPosts(room, [post])
			}
		},
		async remove(room: string, postIds: string[]) {
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.removePosts(room, postIds)
		},
		async clear(room: string) {
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.clearRoom(room)
		},
		async mute(userIds: string[]) {
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.addMute(userIds)
		},
		async unmute(userIds: string[]) {
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.removeMute(userIds)
		},
		async unmuteAll() {
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.unmuteAll()
		},
		async setRoomStatus(room: string, status: ChatStatus) {
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.setRoomStatus(room, status)
		},
	}
}
