
// import mongodb from "mongodb"
// import {objectMap} from "../../../../../toolbox/object-map.js"
// import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
// import {Subbie, subbies} from "../../../../../toolbox/subbies.js"
// import {dbbyMongo} from "../../../../../toolbox/dbby/dbby-mongo.js"
// import {AssertiveMap} from "../../../../../toolbox/assertive-map.js"
// import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
// import {AppRowConstraint, UnconstrainedTables} from "../../../../../framework/api/types/table-namespacing-for-apps.js"
// import {ChatMuteRow, ChatPersistence, ChatPersistenceActions, ChatPost, ChatPostRow, ChatRoomStatusRow, ChatStatus} from "../../../common/types/chat-concepts.js"
// import {down} from "../../../../../toolbox/dbby/dbby-mongo-row-processing.js"

// export async function mongoChatPersistence(): Promise<ChatPersistence> {

// 	const client = await new mongodb.MongoClient("mongodb+srv://blogStore:blogstore@cluster0.ptcuh.mongodb.net/blogStore?retryWrites=true&w=majority").connect()
// 	const db = client.db('test')
// 	const collections = {
// 		muteCollection: db.collection('mutesCollection'),
// 		postCollection: db.collection('postsCollection'),
// 		statusCollection: db.collection('statusCollection'),
// 	}

// 	const chatTablesUnconstrained = new UnconstrainedTables({
// 			posts: dbbyMongo<ChatPostRow>({collection: collections.postCollection}),
// 			mutes: dbbyMongo<ChatMuteRow>({collection: collections.muteCollection}),
// 			roomStatuses: dbbyMongo<ChatRoomStatusRow>({collection: collections.statusCollection})
// 		}
// 	)

// 	const events = {
// 		roomStatusChanged: subbies<{appId: string, room: string, status: ChatStatus}>(),
// 		postsAdded: subbies<{appId: string, room: string, posts: ChatPost[]}>(),
// 		postsRemoved: subbies<{appId: string, room: string, postIds: string[]}>(),
// 		roomCleared: subbies<{appId: string, room: string}>(),
// 		mutes: subbies<{appId: string, userIds: string[]}>(),
// 		unmutes: subbies<{appId: string, userIds: string[]}>(),
// 		unmuteAll: subbies<{appId: string}>(),
// 	}

// 	const postsChangeStream = collections.postCollection.watch()
// 	postsChangeStream.on('change', (change) => {
// 		if(change.operationType == 'insert') {
// 			const {"namespace-appId": appId, room, postId, content, time, userId, nickname} = down<AppRowConstraint & ChatPostRow>(change.fullDocument)
// 			events.postsAdded.publish({appId: appId.toString(), room, posts: [{postId: postId.toString(), content, time, userId: userId.toString(), room, nickname}]})
// 		}
// 		else if(change.operationType == 'delete') {
// 			console.log(0, change)
// 			const {"namespace-appId":appId, room, postId} = down<AppRowConstraint & ChatPostRow>(change.fullDocument)
// 			events.postsRemoved.publish({appId: appId.toString(), room, postIds: [postId.toString()]})
// 			events.roomCleared.publish({appId: appId.toString(), room})
// 		}
// 	})

// 	const mutesChangeStream = collections.muteCollection.watch()
// 	mutesChangeStream.on('change', (change) => {
// 		if(change.operationType == 'insert') {
// 			const {'namespace-appId': appId, userId} = down<AppRowConstraint & ChatMuteRow>(change.fullDocument)
// 			events.mutes.publish({appId: appId.toString(), userIds: [userId.toString()]})
// 		}
// 		else if(change.operationType == 'delete') {
// 			const {'namespace-appId': appId, userId} = down<AppRowConstraint & ChatMuteRow>(change.fullDocument)
// 			events.unmutes.publish({appId: appId.toString(), userIds: [userId.toString()]})
// 			events.unmuteAll.publish({appId: appId.toString()})
// 		}
// 	})

// 	const statusChangeStream = collections.statusCollection.watch(undefined, {fullDocument: "updateLookup"})
// 	statusChangeStream.on('change', (change) => {
// 		const {'namespace-appId': appId, room, status} = down<AppRowConstraint & ChatRoomStatusRow>(change.fullDocument)
// 		events.roomStatusChanged.publish({appId: appId.toString(), room, status})
// 	})

// 	const eventSubscribers =
// 		<{[P in keyof typeof events]: typeof events[P]["subscribe"]}>
// 			objectMap(events, (event: Subbie<any>) => event.subscribe)

// 	const getAppCache = (() => {
// 		const appCaches = new AssertiveMap(() => ({
// 			mutedUserIds: new Set<string>()
// 		}))
// 		return (appId: string) => appCaches.assert(appId)
// 	})()

// 	// listen to events to update cache
// 	{
// 		eventSubscribers.mutes(({appId, userIds}) => {
// 			const cache = getAppCache(appId)
// 			for (const userId of userIds)
// 				cache.mutedUserIds.add(userId)
// 		})
// 		eventSubscribers.unmutes(({appId, userIds}) => {
// 			const cache = getAppCache(appId)
// 			for (const userId of userIds)
// 				cache.mutedUserIds.delete(userId)
// 		})
// 		eventSubscribers.unmuteAll(({appId}) => {
// 			const cache = getAppCache(appId)
// 			cache.mutedUserIds.clear()
// 		})
// 	}

// 	function namespaceForApp(appId: string): ChatPersistenceActions {
// 		const appCache = getAppCache(appId)

// 		const chatTables =
// 			chatTablesUnconstrained
// 				.namespaceForApp(DamnId.fromString(appId))

// 		return {
// 			isMuted(userId: string) {
// 				return appCache.mutedUserIds.has(userId)
// 			},

// 			async fetchRecentPosts(room) {
// 				throw new Error("unimplemented")
// 			},

// 			async fetchMutes() {
// 				throw new Error("unimplemented")
// 			},

// 			async addPosts(room: string, posts: ChatPost[]) {
// 				await chatTables.posts.create(...posts.map(post => ({
// 					...post,
// 					room,
// 					userId: DamnId.fromString(post.userId),
// 					postId: DamnId.fromString(post.postId),
// 				})))
// 			},

// 			async removePosts(room: string, postIds: string[]) {
// 				if (postIds.length) {
// 					await chatTables.posts.delete(findAll(postIds, postId => ({
// 						room,
// 						postId: DamnId.fromString(postId)
// 					})))
// 				}
// 			},

// 			async clearRoom(room: string) {
// 				await chatTables.posts.delete(find({room}))
// 			},

// 			async addMute(userIds: string[]) {
// 				if (userIds.length) {
// 					const existingMutes = await chatTables.mutes.read(
// 						findAll(userIds, userId => ({
// 							userId: DamnId.fromString(userId),
// 						}))
// 					)
// 					const userIdsAlreadyMuted = existingMutes.map(
// 						row => row.userId.toString()
// 					)
// 					const userIdsToBeMuted = userIds.filter(
// 						userId => !userIdsAlreadyMuted.includes(userId)
// 					)
// 					const newMutes = userIdsToBeMuted.map(userId => ({
// 						userId: DamnId.fromString(userId)
// 					}))
// 					await chatTables.mutes.create(...newMutes)
// 				}
// 			},

// 			async removeMute(userIds: string[]) {
// 				if (userIds.length) {
// 					await chatTables.mutes.delete(
// 						findAll(userIds, userId => ({userId: DamnId.fromString(userId)}))
// 					)
// 				}
// 			},

// 			async unmuteAll() {
// 				await chatTables.mutes.delete({conditions: false})
// 			},

// 			async setRoomStatus(room: string, status: ChatStatus) {
// 				await chatTables.roomStatuses.update({
// 					...find({room}),
// 					upsert: {room, status},
// 				})
// 			},

// 			async getRoomStatus(room: string) {
// 				const row = await chatTables.roomStatuses.one(find({room}))
// 				return row
// 					? row.status
// 					: ChatStatus.Offline
// 			},
// 		}
// 	}

// 	return {
// 		events: eventSubscribers,
// 		namespaceForApp,
// 	}
// }
