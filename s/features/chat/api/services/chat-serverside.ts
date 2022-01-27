
import * as renraku from "renraku"

import {Rando} from "dbmage"
import {schema} from "../../../../toolbox/darkvalley.js"
import {chatAllowance} from "../../common/chat-allowance.js"
import {RateLimiter} from "../../../../toolbox/rate-limiter/rate-limiter.js"
import {validateChatDraft, validateChatRoom, validateChatStatus, validateIdArray} from "../../common/chat-validators.js"
import {ChatDraft, ChatMeta, ChatPersistence, ChatPolicy, ChatPost, ChatStats, ChatStatus, ClientRecord} from "../../common/types/chat-concepts.js"

export const makeChatServerside = ({
		rando,
		rateLimiter,
		clientRecord,
		persistence,
		headers,
		policy,
		getStatsFromServerCore,
	}: {
		rando: Rando
		rateLimiter: RateLimiter
		clientRecord: ClientRecord
		persistence: ChatPersistence
		headers: renraku.HttpHeaders
		policy: ChatPolicy
		getStatsFromServerCore: (appId: string) => ChatStats
}) => renraku.api({

	chatServer: renraku.service()
	.policy(async(meta, headers) => {
		const appId = clientRecord.auth?.access.appId
		const persistenceActions = appId
			? persistence.namespaceForApp(appId)
			: undefined
		return {persistenceActions, headers}
	})
	.expose(({persistenceActions, headers}) => {

		const {clientside: {chatClient}} = clientRecord
		const getAllowance = () => chatAllowance(
			clientRecord.auth?.access.permit.privileges ?? []
		)
		const isNotMuted = () => !persistenceActions.isMuted(
			clientRecord.auth?.access.user?.userId,
		)
		const isNotBanned = () => !getAllowance().banned

		function enforceValidation(problems: string[]) {
			if (problems.length !== 0)
				throw new Error("chat validation error")
		}

		return {
			async updateUserMeta(meta: ChatMeta) {
				clientRecord.auth = await policy(meta, headers)
			},
			async getStats() {
				const appId = clientRecord.auth?.access?.appId
				if (!appId)
					throw new renraku.ApiError(400, "cannot get stats before updateUserMeta")
				return getStatsFromServerCore(appId)
			},
			async roomSubscribe(room: string) {
				enforceValidation(validateChatRoom(room))
				if (!getAllowance().viewAllChats)
					return undefined
				clientRecord.rooms.add(room)
				chatClient.roomStatusChanged(
					room,
					await persistenceActions.getRoomStatus(room)
				)
				chatClient.postsAdded(
					room,
					await persistenceActions.fetchRecentPosts(room)
				)
				chatClient.usersMuted(
					(await persistenceActions.fetchMutes())
						.map(({userId}) => userId)
				)
			},
			async roomUnsubscribe(room: string) {
				enforceValidation(validateChatRoom(room))
				if (!getAllowance().viewAllChats)
					return undefined
				clientRecord.rooms.delete(room)
			},
			async post(room: string, draft: ChatDraft) {
				if (rateLimiter.tooMany())
					return undefined
				enforceValidation(schema({
					room: validateChatRoom,
					draft: validateChatDraft,
				})({room, draft}))
				if (!getAllowance().participateInAllChats)
					return undefined
				if (isNotMuted() && isNotBanned()) {
					const post: ChatPost = {
						...draft,
						room,
						time: Date.now(),
						postId: rando.randomId().toString(),
						userId: clientRecord.auth.access.user.userId,
						nickname: clientRecord.auth.access.user.profile.nickname,
					}
					await persistenceActions.addPosts(room, [post])
				}
			},
			async remove(room: string, postIds: string[]) {
				enforceValidation(schema({
					room: validateChatRoom,
					postIds: validateIdArray,
				})({room, postIds}))
				if (!getAllowance().moderateAllChats)
					return undefined
				await persistenceActions.removePosts(room, postIds)
			},
			async clear(room: string) {
				enforceValidation(validateChatRoom(room))
				if (!getAllowance().moderateAllChats)
					return undefined
				await persistenceActions.clearRoom(room)
			},
			async mute(userIds: string[]) {
				enforceValidation(validateIdArray(userIds))
				if (!getAllowance().moderateAllChats)
					return undefined
				await persistenceActions.addMute(userIds)
			},
			async unmute(userIds: string[]) {
				enforceValidation(validateIdArray(userIds))
				if (!getAllowance().moderateAllChats)
					return undefined
				await persistenceActions.removeMute(userIds)
			},
			async unmuteAll() {
				if (!getAllowance().moderateAllChats)
					return undefined
				await persistenceActions.unmuteAll()
			},
			async setRoomStatus(room: string, status: ChatStatus) {
				enforceValidation(schema({
					room: validateChatRoom,
					status: validateChatStatus,
				})({room, status}))
				if (!getAllowance().moderateAllChats)
					return undefined
				await persistenceActions.setRoomStatus(room, status)
			},
		}
	}),

})
