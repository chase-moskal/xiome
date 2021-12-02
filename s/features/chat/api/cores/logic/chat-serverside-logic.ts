
import {Rando} from "../../../../../toolbox/get-rando.js"
import {validateDraft, validatePostIds, validateRoom, validateStatus, validateUserIds} from "../../../common/chat-validators.js"
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

	function enforceValidation(problems: string[]) {
		if (problems.length !== 0)
			throw new Error("chat validation error")
	}

	return {
		async updateUserMeta(meta: ChatMeta) {
			clientRecord.auth = await policy(meta)
		},
		async roomSubscribe(room: string) {
			enforceValidation(validateRoom(room))
			if (!getAllowance().viewAllChats)
				return undefined
			clientRecord.rooms.add(room)
			clientRemote.roomStatusChanged(room, await persistence.getRoomStatus(room))
		},
		async roomUnsubscribe(room: string) {
			enforceValidation(validateRoom(room))
			if (!getAllowance().viewAllChats)
				return undefined
			clientRecord.rooms.delete(room)
		},
		async post(room: string, draft: ChatDraft) {
			enforceValidation([...validateDraft(draft), ...validateRoom(room)])
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
			enforceValidation([...validateRoom(room), ...validatePostIds(postIds)])
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.removePosts(room, postIds)
		},
		async clear(room: string) {
			enforceValidation(validateRoom(room))
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.clearRoom(room)
		},
		async mute(userIds: string[]) {
			enforceValidation(validateUserIds(userIds))
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.addMute(userIds)
		},
		async unmute(userIds: string[]) {
			enforceValidation(validateUserIds(userIds))
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
			enforceValidation([...validateRoom(room), ...validateStatus(status)])
			if (!getAllowance().moderateAllChats)
				return undefined
			await persistence.setRoomStatus(room, status)
		},
	}
}
