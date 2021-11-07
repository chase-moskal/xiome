
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

	async function broadcastToRoom(
			room: string,
			action: (record: ClientRecord) => void,
		) {
		for (const record of clientRecords.values())
			if (record.auth && record.rooms.has(room))
				action(record)
	}

	persistence.onChatPost(({post}) => {
		broadcastToRoom(
			post.room,
			record => record.clientRemote.posted([post]),
		)
	})

	persistence.onChatRoomStatus(({room, status}) => {
		broadcastToRoom(
			room,
			record => record.clientRemote.roomStatus(room, status),
		)
	})

	return {
		broadcast,
		broadcastToRoom,
	}
}
