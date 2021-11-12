
import {Rando} from "../../../../toolbox/get-rando.js"
import {chatAllowance} from "../../common/chat-allowance.js"
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {prepareChatServersideLogic} from "./logic/chat-serverside-logic.js"
import {ChatClientsideLogic, ChatPersistence, ChatPolicy, ClientRecord} from "../../common/types/chat-concepts.js"

export function makeChatServerCore({rando, persistence, policy}: {
		rando: Rando
		persistence: ChatPersistence
		policy: ChatPolicy
	}) {

	const clientRecords = new Set<ClientRecord>()

	async function broadcastToAll(
			action: (
				record: ClientRecord,
				allowance: ReturnType<typeof chatAllowance>
			) => void,
		) {
		for (const record of clientRecords.values())
			if (record.auth)
				action(record, chatAllowance(record.auth.access.permit.privileges))
	}

	async function broadcastToRoom(
			room: string,
			action: (
				record: ClientRecord,
				allowance: ReturnType<typeof chatAllowance>
			) => void,
		) {
		for (const record of clientRecords.values())
			if (record.auth && record.rooms.has(room))
				action(record, chatAllowance(record.auth.access.permit.privileges))
	}

	persistence.onRoomStatusChanged(({room, status}) => {
		broadcastToRoom(
			room,
			record => record.clientRemote.roomStatusChanged(room, status),
		)
	})

	persistence.onPostsAdded(({room, posts}) => {
		broadcastToRoom(
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientRemote.postsAdded(room, posts)
			},
		)
	})

	persistence.onPostsRemoved(({room, postIds}) => {
		broadcastToRoom(
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientRemote.postsRemoved(room, postIds)
			}
		)
	})

	persistence.onMutes(({userIds}) => {
		broadcastToAll((record, allowance) => {
			if (allowance.viewAllChats)
				record.clientRemote.usersMuted(userIds)
		})
	})

	persistence.onUnmutes(({userIds}) => {
		broadcastToAll((record, allowance) => {
			if (allowance.viewAllChats)
				record.clientRemote.usersUnmuted(userIds)
		})
	})

	persistence.onUnmuteAll(() => {
		broadcastToAll((record, allowance) => {
			if (allowance.viewAllChats)
				record.clientRemote.unmuteAll()
		})
	})

	persistence.onRoomCleared(({room}) => {
		broadcastToRoom(
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientRemote.roomCleared(room)
			},
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
