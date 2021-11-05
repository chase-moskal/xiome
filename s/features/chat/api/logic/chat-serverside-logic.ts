
import {AsHandlers} from "../../../../toolbox/lingo/lingo.js"
import {ChatAuth, ChatDatabase, ChatDraft, ChatMeta, ChatPolicy, ChatStatus, ChatClientHandlers} from "../../common/types/chat-concepts.js"

export function prepareChatServersideLogic({
			database,
			clientside,
			policy,
		}: {
			database: ChatDatabase
			clientside: AsHandlers<ChatClientHandlers>
			policy: ChatPolicy
		}) {
	let auth: ChatAuth
	return {
		async updateUserMeta(meta: ChatMeta) {
			auth = await policy(meta)
		},
		async roomSubscribe(room: string) {
			clientside.roomStatus(room, ChatStatus.Offline)
		},
		async roomUnsubscribe(room: string) {},
		async post(room: string, draft: ChatDraft) {},
		async remove(room: string, messageIds: string[]) {},
		async clear(room: string) {},
		async mute(userIds: string[]) {},
		async setRoomStatus(room: string, status: ChatStatus) {},
	}
}
