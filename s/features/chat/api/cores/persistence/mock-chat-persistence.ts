
import {subbies} from "../../../../../toolbox/subbies.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"
import {ChatPost, ChatStatus, ChatTables} from "../../../common/types/chat-concepts.js"
import {mockStorageTables} from "../../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockChatPersistence(storage: FlexStorage) {

	const cachedMutedUserIds = new Set<string>()

	const chatTables = await mockStorageTables<ChatTables>(storage, {
		posts: true,
		mutes: true,
		roomStatuses: true,
	})

	const events = {
		roomStatusChanged: subbies<{room: string, status: ChatStatus}>(),
		postsAdded: subbies<{room: string, posts: ChatPost[]}>(),
		postsRemoved: subbies<{room: string, postIds: string[]}>(),
		roomCleared: subbies<{room: string}>(),
		mutes: subbies<{userIds: string[]}>(),
		unmutes: subbies<{userIds: string[]}>(),
	}

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
			events.postsAdded.publish({room, posts})
		},

		async removePosts(room: string, postIds: string[]) {
			if (postIds.length) {
				await chatTables.posts.delete(findAll(postIds, postId => ({
					room,
					postId: DamnId.fromString(postId)
				})))
				events.postsRemoved.publish({room, postIds})
			}
		},

		async clearRoom(room: string) {
			await chatTables.posts.delete(find({room}))
			events.roomCleared.publish({room})
		},

		async addMute(userIds: string[]) {
			if (userIds.length) {
				await chatTables.mutes.create(
					...userIds.map(userId => ({userId}))
				)
				events.mutes.publish({userIds})
			}
		},

		async removeMute(userIds: string[]) {
			if (userIds.length) {
				await chatTables.mutes.delete(
					findAll(userIds, userId => ({userId}))
				)
				events.unmutes.publish({userIds})
			}
		},

		async setRoomStatus(room: string, status: ChatStatus) {
			await chatTables.roomStatuses.update({
				...find({room}),
				upsert: {room, status},
			})
			events.roomStatusChanged.publish({room, status})
		},

		async getRoomStatus(room: string) {
			const row = await chatTables.roomStatuses.one(find({room}))
			return row
				? row.status
				: ChatStatus.Offline
		},
	}
}
