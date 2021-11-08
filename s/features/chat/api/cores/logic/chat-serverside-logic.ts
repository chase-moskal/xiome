
import {Rando} from "../../../../../toolbox/get-rando.js"
import {chatAllowance} from "../../../common/chat-allowance.js"
import {ChatDraft, ChatMeta, ChatPersistence, ChatPolicy, ChatPost, ChatStatus, ClientRecord} from "../../../common/types/chat-concepts.js"

export function prepareChatServersideLogic({
			rando,
			clientRecord,
			persistence,
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

	return {
		async updateUserMeta(meta: ChatMeta) {
			clientRecord.auth = await policy(meta)
		},
		async roomSubscribe(room: string) {
			clientRecord.rooms.add(room)
			clientRemote.roomStatus(room, await persistence.getRoomStatus(room))
		},
		async roomUnsubscribe(room: string) {
			clientRecord.rooms.delete(room)
		},
		async post(room: string, draft: ChatDraft) {
			// TODO validate draft
			if (getAllowance().participateInAllChats) {
				const chatPost: ChatPost = {
					...draft,
					time: Date.now(),
					messageId: rando.randomId().toString(),
					userId: rando.randomId().toString(),
				}
				await persistence.insertChatPost(chatPost)
			}
		},
		async remove(room: string, messageIds: string[]) {},
		async clear(room: string) {},
		async mute(userIds: string[]) {},
		async setRoomStatus(room: string, status: ChatStatus) {
			await persistence.setRoomStatus(room, status)
		},
	}
}
