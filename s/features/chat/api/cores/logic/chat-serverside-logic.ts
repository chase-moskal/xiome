
import {makeChatServerGlobalist} from "../globalist/chat-server-globalist.js"
import {ChatDraft, ChatMeta, ChatPolicy, ChatStatus, ClientRecord} from "../../../common/types/chat-concepts.js"

export function prepareChatServersideLogic({
			clientRecord,
			globalist,
			policy,
		}: {
			clientRecord: ClientRecord
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
		async post(room: string, draft: ChatDraft) {},
		async remove(room: string, messageIds: string[]) {},
		async clear(room: string) {},
		async mute(userIds: string[]) {},
		async setRoomStatus(room: string, status: ChatStatus) {
			await globalist.broadcast(record =>
				record.clientRemote.roomStatus(room, status))
		},
	}
}
