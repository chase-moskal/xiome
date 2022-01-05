
import mongodb from "mongodb"
import {objectMap} from "../../../../../toolbox/object-map.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {Subbie, subbies} from "../../../../../toolbox/subbies.js"
import {dbbyMongo} from "../../../../../toolbox/dbby/dbby-mongo.js"
import {AssertiveMap} from "../../../../../toolbox/assertive-map.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {UnconstrainedTables} from "../../../../../framework/api/types/table-namespacing-for-apps.js"
import {ChatMuteRow, ChatPost, ChatPostRow, ChatRoomStatusRow, ChatStatus} from "../../../common/types/chat-concepts.js"

export async function mongoChatPersistence() {

	const client = await new mongodb.MongoClient("mongodb://localhost:27017/test").connect()
	const db = client.db('test')
	const collections = {
		muteCollection: db.collection('mutesCollection'),
		postCollection: db.collection('postsCollection'),
		statusCollection: db.collection('statusCollection'),
	}

	const chatTablesUnconstrained = new UnconstrainedTables({
			posts: dbbyMongo<ChatPostRow>({collection: collections.postCollection}),
			mutes: dbbyMongo<ChatMuteRow>({collection: collections.muteCollection}),
			roomStatuses: dbbyMongo<ChatRoomStatusRow>({collection: collections.statusCollection})
		}
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

	const postsChangeStream = collections.postCollection.watch()
	postsChangeStream.on('change', (change) => {
		if(change.operationType == 'insert') {
			const {appId, room, posts} = change.fullDocument
			events.postsAdded.publish({appId, room, posts})
		}
		else if(change.operationType == 'delete') {
			const {appId, room, postIds} = change.fullDocument
			events.postsRemoved.publish({appId, room, postIds})
			events.roomCleared.publish({appId, room})
		}
	})

	const mutesChangeStream = collections.muteCollection.watch()
	mutesChangeStream.on('change', (change) => {
		if(change.operationType == 'insert') {
			const {appId, userIdsToBeMuted} = change.fullDocument
			events.mutes.publish({appId, userIds: userIdsToBeMuted})
		}
		else if(change.operationType == 'delete') {
			const {appId, userIds} = change.fullDocument
			events.unmutes.publish({appId, userIds})
			events.unmuteAll.publish({appId})
		}
	})

	const statusChangeStream = collections.statusCollection.watch()
	statusChangeStream.on('change', (change) => {
		const {appId, room, status} = change.fullDocument
		events.roomStatusChanged.publish({appId, room, status})
	})

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

			async addPosts(room: string, posts: ChatPost[]) {
				await chatTables.posts.create(...posts.map(post => ({
					...post,
					room,
					userId: DamnId.fromString(post.userId),
					postId: DamnId.fromString(post.postId),
				})))
			},

			async removePosts(room: string, postIds: string[]) {
				if (postIds.length) {
					await chatTables.posts.delete(findAll(postIds, postId => ({
						room,
						postId: DamnId.fromString(postId)
					})))
				}
			},

			async clearRoom(room: string) {
				await chatTables.posts.delete(find({room}))
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
				}
			},

			async removeMute(userIds: string[]) {
				if (userIds.length) {
					await chatTables.mutes.delete(
						findAll(userIds, userId => ({userId: DamnId.fromString(userId)}))
					)
				}
			},

			async unmuteAll() {
				await chatTables.mutes.delete({conditions: false})
			},

			async setRoomStatus(room: string, status: ChatStatus) {
				await chatTables.roomStatuses.update({
					...find({room}),
					upsert: {room, status},
				})
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
