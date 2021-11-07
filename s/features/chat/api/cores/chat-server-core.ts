
import {Rando} from "../../../../toolbox/get-rando.js"
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {prepareChatServersideLogic} from "./logic/chat-serverside-logic.js"
import {prepareChatClientsideLogic} from "./logic/chat-clientside-logic.js"
import {ChatClientsideLogic, ChatPersistence, ChatPolicy, ClientRecord} from "../../common/types/chat-concepts.js"

export function makeChatServerCore({rando, persistence, policy}: {
		rando: Rando
		persistence: ChatPersistence
		policy: ChatPolicy
	}) {

	const clientRecords = new Set<ClientRecord>()

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

	async function acceptConnection({disconnect, sendDataToClient}: {
			disconnect(): void
			sendDataToClient: (...args: any[]) => Promise<void>
		}) {

		const clientRecord: ClientRecord = {
			auth: undefined,
			rooms: new Set(),
			clientRemote: lingoRemote<ChatClientsideLogic>({
				send: sendDataToClient,
			}),
		}

		clientRecords.add(clientRecord)

		return {
			handleDataFromClient: lingoHost(prepareChatServersideLogic({
				rando,
				persistence,
				clientRecord,
				policy,
			})),
			handleDisconnect() {
				disconnect()
				clientRecords.delete(clientRecord)
			},
		}
	}

	return {
		acceptConnection,
		get clientCount() { return clientRecords.size },
	}
}
