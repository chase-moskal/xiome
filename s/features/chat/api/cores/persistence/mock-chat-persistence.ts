
import {subbies} from "../../../../../toolbox/subbies.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"
import {ChatPost, ChatStatus, ChatTables} from "../../../common/types/chat-concepts.js"
import {mockStorageTables} from "../../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockChatPersistence(storage: FlexStorage) {

	const chatTables = await mockStorageTables<ChatTables>(storage, {
		chatPosts: true,
		chatRoomStatus: true,
	})

	const events = {
		postsAdded: subbies<{room: string, posts: ChatPost[]}>(),
		postsRemoved: subbies<{room: string, postIds: string[]}>(),
		roomStatusesChanged: subbies<{room: string, status: ChatStatus}>(),
	}

	return {

		onPostsAdded(handler: ({}: {room: string, posts: ChatPost[]}) => void) {
			return events.postsAdded.subscribe(handler)
		},

		onPostsRemoved(handler: ({}: {room: string, postIds: string[]}) => void) {
			return events.postsRemoved.subscribe(handler)
		},

		onRoomStatusChanged(handler: ({}: {room: string, status: ChatStatus}) => void) {
			return events.roomStatusesChanged.subscribe(handler)
		},

		async addPosts(room: string, posts: ChatPost[]) {
			await chatTables.chatPosts.create(...posts.map(post => ({
				...post,
				room,
				userId: DamnId.fromString(post.userId),
				postId: DamnId.fromString(post.postId),
			})))
			events.postsAdded.publish({room, posts})
		},

		async removePosts(room: string, postIds: string[]) {
			if (postIds.length) {
				await chatTables.chatPosts.delete(findAll(postIds, postId => ({
					room,
					postId: DamnId.fromString(postId)
				})))
				events.postsRemoved.publish({room, postIds})
			}
		},

		async clearAllPostsInRoom(room: string) {
			await chatTables.chatPosts.delete(find({room}))
		},

		async setRoomStatus(room: string, status: ChatStatus) {
			await chatTables.chatRoomStatus.update({
				...find({room}),
				upsert: {room, status},
			})
			events.roomStatusesChanged.publish({room, status})
		},

		async getRoomStatus(room: string) {
			const row = await chatTables.chatRoomStatus.one(find({room}))
			return row
				? row.status
				: ChatStatus.Offline
		},
	}
}
