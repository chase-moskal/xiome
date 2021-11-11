
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
	const requireAllowance = () => {
		const allowance = getAllowance()
		return objectMap(allowance, (allowed, key) => () => {
			if (!allowed)
				throw new Error(`action forbidden, lacking privilege "${key}"`)
		})
	}
	const isNotMuted = () => !persistence.isMuted(
		clientRecord.auth.access.user.userId,
	)
	const isNotBanned = () => !getAllowance().banned

	return {
		async updateUserMeta(meta: ChatMeta) {
			clientRecord.auth = await policy(meta)
		},
		async roomSubscribe(room: string) {
			clientRecord.rooms.add(room)
			clientRemote.roomStatusChanged(room, await persistence.getRoomStatus(room))
		},
		async roomUnsubscribe(room: string) {
			clientRecord.rooms.delete(room)
		},
		async post(room: string, draft: ChatDraft) {
			requireAllowance().participateInAllChats()
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
			requireAllowance().moderateAllChats()
			await persistence.removePosts(room, postIds)
		},
		async clear(room: string) {
			requireAllowance().moderateAllChats()
			await persistence.clearRoom(room)
		},
		async mute(userIds: string[]) {
			await persistence.addMute(userIds)
		},
		async unmute(userIds: string[]) {
			await persistence.removeMute(userIds)
		},
		async setRoomStatus(room: string, status: ChatStatus) {
			await persistence.setRoomStatus(room, status)
		},
	}
}
