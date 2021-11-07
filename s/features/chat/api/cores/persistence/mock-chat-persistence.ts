
import {subbies} from "../../../../../toolbox/subbies.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"
import {ChatPost, ChatStatus, ChatTables} from "../../../common/types/chat-concepts.js"
import {mockStorageTables} from "../../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockChatPersistence(storage: FlexStorage) {

	const chatTables = await mockStorageTables<ChatTables>(storage, {
		chatPosts: true,
		chatRoomStatus: true,
	})

	const events = {
		post: subbies<{post: ChatPost}>(),
		status: subbies<{room: string, status: ChatStatus}>(),
	}

	return {

		onChatPost(handler: ({}: {post: ChatPost}) => void) {
			return events.post.subscribe(handler)
		},

		onChatRoomStatus(handler: ({}: {room: string, status: ChatStatus}) => void) {
			return events.status.subscribe(handler)
		},

		async insertChatPost(post: ChatPost) {
			await chatTables.chatPosts.create({
				...post,
				userId: DamnId.fromString(post.userId),
				messageId: DamnId.fromString(post.messageId),
			})
			events.post.publish({post})
		},

		async setRoomStatus(room: string, status: ChatStatus) {
			await chatTables.chatRoomStatus.update({
				...find({room}),
				upsert: {room, status},
			})
			events.status.publish({room, status})
		},

		async getRoomStatus(room: string) {
			const row = await chatTables.chatRoomStatus.one(find({room}))
			return row
				? row.status
				: ChatStatus.Offline
		},
	}
}
