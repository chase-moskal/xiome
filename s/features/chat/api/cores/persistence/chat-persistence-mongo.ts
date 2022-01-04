
import {on} from "events"
import mongodb, {ChangeStream} from "mongodb"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {dbbyMongo} from "../../../../../toolbox/dbby/dbby-mongo.js"
import {subbies} from "../../../../../toolbox/subbies.js"
import {ChatMuteRow, ChatPost, ChatPostRow, ChatRoomStatusRow, ChatStatus} from "../../../common/types/chat-concepts.js"
import {mockChatPersistence} from "./mock-chat-persistence.js"

export async function mongoChatPersistence(): ReturnType<typeof mockChatPersistence> {

	const client = await new mongodb.MongoClient("mongodb://localhost:27017/test").connect()
	const db = client.db('test')
	const collections = {
		muteCollection: db.collection('mutesCollection'),
		postCollection: db.collection('postsCollection'),
		statusCollection: db.collection('statusCollection'),
	}

	const chatTables = {
		posts: dbbyMongo<ChatPostRow>({collection: collections.postCollection}),
		mutes: dbbyMongo<ChatMuteRow>({collection: collections.muteCollection}),
		roomStatuses: dbbyMongo<ChatRoomStatusRow>({collection: collections.statusCollection})
	}

	const events = {
		roomStatusChanged: subbies<{room: string, status: ChatStatus}>(),
		postsAdded: subbies<{room: string, posts: ChatPost[]}>(),
		postsRemoved: subbies<{room: string, postIds: string[]}>(),
		roomCleared: subbies<{room: string}>(),
		mutes: subbies<{userIds: string[]}>(),
		unmutes: subbies<{userIds: string[]}>(),
		unmuteAll: subbies<undefined>(),
	}

	const postsChangeStream = collections.postCollection.watch()
	postsChangeStream.on('change', (change) => {
		if(change.operationType == 'insert') {
			const {room, posts} = change.fullDocument
			events.postsAdded.publish({room, posts})
		}
		else if(change.operationType == 'delete') {
			const {room, postIds} = change.fullDocument
			events.postsRemoved.publish({room, postIds})
			events.roomCleared.publish({room})
		}
	})

	const mutesChangeStream = collections.muteCollection.watch()
	mutesChangeStream.on('change', (change) => {
		if(change.operationType == 'insert') {
			const {userIds} = change.fullDocument
			events.mutes.publish({userIds})
		}
		else if(change.operationType == 'delete') {
			const {userIds} = change.fullDocument
			events.unmutes.publish({userIds})
			events.unmuteAll.publish(undefined)
		}
	})

	const statusChangeStream = collections.statusCollection.watch()
	statusChangeStream.on('change', (change) => {
		const {room, status} = change.fullDocument
		events.roomStatusChanged.publish({room, status})
	})

	const cachedMutedUserIds = new Set<string>()

	return {

		onRoomStatusChanged(handler: ({}: {room: string, status: ChatStatus}) => void) {
			return events.roomStatusChanged.subscribe(handler)
		},

		onPostsAdded(handler: ({}: {room: string, posts: ChatPost[]}) => void) {
			return events.postsAdded.subscribe(handler)
		},

		onPostsRemoved(handler: ({}: {room: string, postIds: string[]}) => void) {
			return events.postsRemoved.subscribe(handler)
		},

		onRoomCleared(handler: ({}: {room: string}) => void) {
			return events.roomCleared.subscribe(handler)
		},

		onMutes(handler: ({}: {userIds: string[]}) => void) {
			return events.mutes.subscribe(({userIds}) => {
				for (const userId of userIds)
					cachedMutedUserIds.add(userId)
				handler({userIds})
			})
		},

		onUnmutes(handler: ({}: {userIds: string[]}) => void) {
			return events.unmutes.subscribe(({userIds}) => {
				for (const userId of userIds)
					cachedMutedUserIds.delete(userId)
				handler({userIds})
			})
		},

		onUnmuteAll(handler: () => void) {
			return events.unmuteAll.subscribe(() => {
				cachedMutedUserIds.clear()
				handler()
			})
		},

		isMuted(userId: string) {
			return cachedMutedUserIds.has(userId)
		},

		async addPosts(room: string, posts: ChatPost[]) {
			await chatTables.posts.create(...posts.map(post => ({
				...post,
				room,
				userId: DamnId.fromString(post.userId),
				postId: DamnId.fromString(post.postId),
			})))
			// events.postsAdded.publish({room, posts})
		},

		async removePosts(room: string, postIds: string[]) {
			if (postIds.length) {
				await chatTables.posts.delete(findAll(postIds, postId => ({
					room,
					postId: DamnId.fromString(postId)
				})))
				// events.postsRemoved.publish({room, postIds})
			}
		},

		async clearRoom(room: string) {
			await chatTables.posts.delete(find({room}))
			// events.roomCleared.publish({room})
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
				// events.mutes.publish({userIds: userIdsToBeMuted})
			}
		},

		async removeMute(userIds: string[]) {
			if (userIds.length) {
				await chatTables.mutes.delete(
					findAll(userIds, userId => ({userId: DamnId.fromString(userId)}))
				)
				// events.unmutes.publish({userIds})
			}
		},

		async unmuteAll() {
			await chatTables.mutes.delete({conditions: false})
			events.unmuteAll.publish(undefined)
		},

		async setRoomStatus(room: string, status: ChatStatus) {
			await chatTables.roomStatuses.update({
				...find({room}),
				upsert: {room, status},
			})
			// events.roomStatusChanged.publish({room, status})
		},

		async getRoomStatus(room: string) {
			const row = await chatTables.roomStatuses.one(find({room}))
			return row
				? row.status
				: ChatStatus.Offline
		},
	}
}
