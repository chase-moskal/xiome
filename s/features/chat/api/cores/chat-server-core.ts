
import * as renraku from "renraku"

import {Rando} from "../../../../toolbox/get-rando.js"
import {chatAllowance} from "../../common/chat-allowance.js"
import {makeChatClientside} from "../services/chat-clientside.js"
import {makeChatServerside} from "../services/chat-serverside.js"
import {RateLimiter} from "../../../../toolbox/rate-limiter/rate-limiter.js"
import {chatPostCoolOff, chatRateLimitingInterval} from "../../common/chat-constants.js"
import {ChatPersistence, ChatPolicy, ClientRecord} from "../../common/types/chat-concepts.js"

const pingInterval = 10 * 1000

export function makeChatServerCore({
		rando, persistence, policy,
	}: {
		rando: Rando
		persistence: ChatPersistence
		policy: ChatPolicy
	}) {

	const clientRecords = new Set<ClientRecord>()

	async function broadcastToAll(
			appId: string,
			action: (
				record: ClientRecord,
				allowance: ReturnType<typeof chatAllowance>
			) => void,
		) {
		for (const record of clientRecords.values())
			if (record.auth && record.auth.access.appId === appId)
				action(record, chatAllowance(record.auth.access.permit.privileges))
	}

	async function broadcastToRoom(
			appId: string,
			room: string,
			action: (
				record: ClientRecord,
				allowance: ReturnType<typeof chatAllowance>
			) => void,
		) {
		for (const record of clientRecords.values())
			if (record.auth && record.auth.access.appId === appId && record.rooms.has(room))
				action(record, chatAllowance(record.auth.access.permit.privileges))
	}

	persistence.events.roomStatusChanged(({appId, room, status}) => {
		broadcastToRoom(
			appId,
			room,
			record => record.clientside.chatClient.roomStatusChanged(room, status),
		)
	})

	persistence.events.postsAdded(({appId, room, posts}) => {
		broadcastToRoom(
			appId,
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientside.chatClient.postsAdded(room, posts)
			},
		)
	})

	persistence.events.postsRemoved(({appId, room, postIds}) => {
		broadcastToRoom(
			appId,
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientside.chatClient.postsRemoved(room, postIds)
			}
		)
	})

	persistence.events.mutes(({appId, userIds}) => {
		broadcastToAll(appId, (record, allowance) => {
			if (allowance.viewAllChats)
				record.clientside.chatClient.usersMuted(userIds)
		})
	})

	persistence.events.unmutes(({appId, userIds}) => {
		broadcastToAll(appId, (record, allowance) => {
			if (allowance.viewAllChats)
				record.clientside.chatClient.usersUnmuted(userIds)
		})
	})

	persistence.events.unmuteAll(({appId}) => {
		broadcastToAll(appId, (record, allowance) => {
			if (allowance.viewAllChats)
				record.clientside.chatClient.unmuteAll()
		})
	})

	persistence.events.roomCleared(({appId, room}) => {
		broadcastToRoom(
			appId,
			room,
			(record, allowance) => {
				if (allowance.viewAllChats)
					record.clientside.chatClient.roomCleared(room)
			},
		)
	})

	function acceptNewClient({headers, controls, clientside, handleDisconnect}: {
			headers: renraku.HttpHeaders
			controls: renraku.ConnectionControls
			clientside: renraku.Remote<ReturnType<typeof makeChatClientside>>
			handleDisconnect: () => void
		}) {
		const clientRecord: ClientRecord = {
			auth: undefined,
			rooms: new Set(),
			clientside,
			controls,
		}
		clientRecords.add(clientRecord)
		const rateLimiter = new RateLimiter({
			timeframe: chatRateLimitingInterval,
			maximum: chatRateLimitingInterval / chatPostCoolOff,
		})
		const interval = setInterval(controls.ping, pingInterval)
		return {
			api: makeChatServerside({
				rando,
				rateLimiter,
				persistence,
				clientRecord,
				headers,
				policy,
			}),
			disconnect() {
				clearInterval(interval)
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
