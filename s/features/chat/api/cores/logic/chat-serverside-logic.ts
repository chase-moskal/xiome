
import {Rando} from "../../../../../toolbox/get-rando.js"
import {makeChatServerGlobalist} from "../globalist/chat-server-globalist.js"
import {ChatDraft, ChatMeta, ChatPersistence, ChatPolicy, ChatPost, ChatStatus, ClientRecord} from "../../../common/types/chat-concepts.js"

export function prepareChatServersideLogic({
			rando,
			clientRecord,
			persistence,
			globalist,
			policy,
		}: {
			rando: Rando
			clientRecord: ClientRecord
			persistence: ChatPersistence
			globalist: ReturnType<typeof makeChatServerGlobalist>
			policy: ChatPolicy
		}) {

	const {clientRemote} = clientRecord

	return {
		async updateUserMeta(meta: ChatMeta) {
			clientRecord.auth = await policy(meta)
		},
		async roomSubscribe(room: string) {
			clientRemote.roomStatus(room, ChatStatus.Offline)
		},
		async roomUnsubscribe(room: string) {},
		async post(room: string, draft: ChatDraft) {
			// TODO validate draft
			const chatPost: ChatPost = {
				...draft,
				time: Date.now(),
				messageId: rando.randomId().toString(),
				userId: rando.randomId().toString(),
			}
			await persistence.insertChatPost(chatPost)
		},
		async remove(room: string, messageIds: string[]) {},
		async clear(room: string) {},
		async mute(userIds: string[]) {},
		async setRoomStatus(room: string, status: ChatStatus) {
			await persistence.setRoomStatus(room, status)
		},
	}
}
