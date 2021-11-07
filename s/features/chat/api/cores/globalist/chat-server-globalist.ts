
import {ChatPersistence, ClientRecord} from "../../../common/types/chat-concepts.js"

export function makeChatServerGlobalist({clientRecords, persistence}: {
		persistence: ChatPersistence
		clientRecords: Set<ClientRecord>
	}) {

	async function broadcast(action: (record: ClientRecord) => void) {
		for (const record of clientRecords.values())
			if (record.auth)
				action(record)
	}

	persistence.onChatPost(({post}) => {
		broadcast(record => record.clientRemote.posted([post]))
	})

	persistence.onChatRoomStatus(({room, status}) => {
		broadcast(record => record.clientRemote.roomStatus(room, status))
	})

	return {
		broadcast,
	}
}
