
import * as renraku from "renraku"

import {Rando} from "../../../../toolbox/get-rando.js"
import {chatAllowance} from "../../common/chat-allowance.js"
import {makeChatClientside} from "../services/chat-clientside.js"
import {makeChatServerside} from "../services/chat-serverside.js"
import {ChatPersistence, ChatPolicy, ClientRecord} from "../../common/types/chat-concepts.js"

export function makeChatServerCore({rando, persistence, policy, logError}: {
		rando: Rando
		persistence: ChatPersistence
		policy: ChatPolicy
		logError: (error: Error) => void
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
			record => record.clientside.chatClient.roomStatusChanged(room, status),
		)
	})

	persistence.onPostsAdded(({room, posts}) => {
		broadcastToRoom(
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientside.chatClient.postsAdded(room, posts)
			},
		)
	})

	persistence.onPostsRemoved(({room, postIds}) => {
		broadcastToRoom(
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientside.chatClient.postsRemoved(room, postIds)
			}
		)
	})

	persistence.onMutes(({userIds}) => {
		broadcastToAll((record, allowance) => {
			if (allowance.viewAllChats)
				record.clientside.chatClient.usersMuted(userIds)
		})
	})

	persistence.onUnmutes(({userIds}) => {
		broadcastToAll((record, allowance) => {
			if (allowance.viewAllChats)
				record.clientside.chatClient.usersUnmuted(userIds)
		})
	})

	persistence.onUnmuteAll(() => {
		broadcastToAll((record, allowance) => {
			if (allowance.viewAllChats)
				record.clientside.chatClient.unmuteAll()
		})
	})

	persistence.onRoomCleared(({room}) => {
		broadcastToRoom(
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientside.chatClient.roomCleared(room)
			},
		)
	})

	function acceptNewClient({clientside, handleDisconnect}: {
			clientside: renraku.Remote<ReturnType<typeof makeChatClientside>>
			handleDisconnect: () => void
		}) {
		const clientRecord: ClientRecord = {
			auth: undefined,
			rooms: new Set(),
			clientside,
		}
		clientRecords.add(clientRecord)
		return {
			api: makeChatServerside({
				rando,
				persistence,
				clientRecord,
				policy,
			}),
			disconnect() {
				handleDisconnect()
				clientRecords.delete(clientRecord)
			},
		}
	}

	return {
		acceptNewClient,
		get clientCount() { return clientRecords.size },
	}
}
