
import {objectMap} from "../../../../../toolbox/object-map.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {Subbie, subbies} from "../../../../../toolbox/subbies.js"
import {AssertiveMap} from "../../../../../toolbox/assertive-map.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"
import {ChatMute, ChatPost, ChatPostRow, ChatStatus, ChatTables} from "../../../common/types/chat-concepts.js"
import {mockStorageTables} from "../../../../../assembly/backend/tools/mock-storage-tables.js"
import {UnconstrainedTables} from "../../../../../framework/api/types/table-namespacing-for-apps.js"
import {maximumNumberOfPostsShownAtOnce} from "../../../common/chat-constants.js"

export async function mockChatPersistence(storage: FlexStorage) {

	const chatTablesUnconstrained = new UnconstrainedTables(
		await mockStorageTables<ChatTables>(storage, {
			posts: true,
			mutes: true,
			roomUsers: true,
			roomStatuses: true,
		})
	)

	const events = {
		roomStatusChanged: subbies<{appId: string, room: string, status: ChatStatus}>(),
		postsAdded: subbies<{appId: string, room: string, posts: ChatPost[]}>(),
		postsRemoved: subbies<{appId: string, room: string, postIds: string[]}>(),
		roomCleared: subbies<{appId: string, room: string}>(),
		mutes: subbies<{appId: string, userIds: string[]}>(),
		unmutes: subbies<{appId: string, userIds: string[]}>(),
		unmuteAll: subbies<{appId: string}>(),
	}

	const eventSubscribers =
		<{[P in keyof typeof events]: typeof events[P]["subscribe"]}>
			objectMap(events, (event: Subbie<any>) => event.subscribe)

	const getAppCache = (() => {
		const appCaches = new AssertiveMap(() => ({
			mutedUserIds: new Set<string>()
		}))
		return (appId: string) => appCaches.assert(appId)
	})()

	// listen to events to update cache
	{
		eventSubscribers.mutes(({appId, userIds}) => {
			const cache = getAppCache(appId)
			for (const userId of userIds)
				cache.mutedUserIds.add(userId)
		})
		eventSubscribers.unmutes(({appId, userIds}) => {
			const cache = getAppCache(appId)
			for (const userId of userIds)
				cache.mutedUserIds.delete(userId)
		})
		eventSubscribers.unmuteAll(({appId}) => {
			const cache = getAppCache(appId)
			cache.mutedUserIds.clear()
		})
	}

	function namespaceForApp(appId: string) {
		const appCache = getAppCache(appId)

		const chatTables =
			chatTablesUnconstrained
				.namespaceForApp(DamnId.fromString(appId))

		return {
			isMuted(userId: string) {
				return appCache.mutedUserIds.has(userId)
			},

			async getUserCounts() {},

			async addUserCount({}: {participants: number, viewers: number}) {},

			async addPosts(room: string, posts: ChatPost[]) {
				await chatTables.posts.create(
					...posts.map(post => (<ChatPostRow>{
						room: post.room,
						time: post.time,
						content: post.content,
						nickname: post.nickname,
						userId: DamnId.fromString(post.userId),
						postId: DamnId.fromString(post.postId),
					}))
				)
				events.postsAdded.publish({appId, room, posts})
			},

			async removePosts(room: string, postIds: string[]) {
				if (postIds.length) {
					await chatTables.posts.delete(findAll(postIds, postId => ({
						room,
						postId: DamnId.fromString(postId)
					})))
					events.postsRemoved.publish({appId, room, postIds})
				}
			},

			async fetchRecentPosts(room: string): Promise<ChatPost[]> {
				const rawPosts = await chatTables.posts.read({
					...find({room}),
					limit: maximumNumberOfPostsShownAtOnce,
					order: {time: "descend"},
				})
				const recentPosts = rawPosts.map(post => ({
					room: post.room,
					time: post.time,
					content: post.content,
					nickname: post.nickname,
					postId: post.postId.toString(),
					userId: post.userId.toString(),
				}))
				const postsSortedByTime = recentPosts.sort((a, b) => a.time - b.time)
				return postsSortedByTime
			},

			async fetchMutes(): Promise<ChatMute[]> {
				const rows = await chatTables.mutes.read({conditions: false})
				return rows.map(row => ({userId: row.userId.toString()}))
			},

			async clearRoom(room: string) {
				await chatTables.posts.delete(find({room}))
				events.roomCleared.publish({appId, room})
			},

			async addMute(userIds: string[]) {
				if (userIds.length) {
					const existingMutes = await chatTables.mutes.read(
						findAll(userIds, userId => ({
							userId: DamnId.fromString(userId),
						}))
					)
					const userIdsAlreadyMuted = existingMutes.map(
						row => row.userId.toString()
					)
					const userIdsToBeMuted = userIds.filter(
						userId => !userIdsAlreadyMuted.includes(userId)
					)
					const newMutes = userIdsToBeMuted.map(userId => ({
						userId: DamnId.fromString(userId)
					}))
					await chatTables.mutes.create(...newMutes)
					events.mutes.publish({appId, userIds: userIdsToBeMuted})
				}
			},

			async removeMute(userIds: string[]) {
				if (userIds.length) {
					await chatTables.mutes.delete(
						findAll(userIds, userId => ({userId: DamnId.fromString(userId)}))
					)
					events.unmutes.publish({appId, userIds})
				}
			},

			async unmuteAll() {
				await chatTables.mutes.delete({conditions: false})
				events.unmuteAll.publish({appId})
			},

			async setRoomStatus(room: string, status: ChatStatus) {
				await chatTables.roomStatuses.update({
					...find({room}),
					upsert: {room, status},
				})
				events.roomStatusChanged.publish({appId, room, status})
			},

			async getRoomStatus(room: string) {
				const row = await chatTables.roomStatuses.one(find({room}))
				return row
					? row.status
					: ChatStatus.Offline
			},
		}
	}

	return {
		events: eventSubscribers,
		namespaceForApp,
	}
}
