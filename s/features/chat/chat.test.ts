
import {assert, expect, Suite} from "cynic"

import {nap} from "../../toolbox/nap.js"
import {ChatStatus} from "./common/types/chat-concepts.js"
import {testChatSetup} from "./testing/test-chat-setup.js"

export default<Suite>{

	"room online/offline behavior": {
		async "viewer can find that a room starts offline"() {
			const setup = await testChatSetup()
			const server = await setup.makeServer()
			const {chatModel} = await server.makeClientFor.viewer()
			const room = await chatModel.room("default")

			assert(room.status === ChatStatus.Offline, "room should start offline")
		},

		async "moderator can and set a room online"() {
			const setup = await testChatSetup()
			const server = await setup.makeServer()
			const {chatModel} = await server.makeClientFor.moderator()
			const room = await chatModel.room("default")
			assert(room.status === ChatStatus.Offline, "room should start offline")

			room.setRoomStatus(ChatStatus.Online)
			await nap()

			assert(room.status === ChatStatus.Online, "room should be online")
		},

		async "moderator can set a room online, other participant sees this"() {
			const setup = await testChatSetup()
			const server = await setup.makeServer()

			// participant sees room offline

			const participant = await server.makeClientFor.participant()
			const participantRoom = await participant.chatModel.room("default")
			expect(participantRoom.status).equals(ChatStatus.Offline)
	
			// moderator sets room online

			const moderator = await server.makeClientFor.moderator()
			const moderatorRoom = await moderator.chatModel.room("default")
			expect(moderatorRoom.status).equals(ChatStatus.Offline)

			moderatorRoom.setRoomStatus(ChatStatus.Online)
			await nap()

			expect(moderatorRoom.status).equals(ChatStatus.Online)

			// participant sees it

			expect(participantRoom.status).equals(ChatStatus.Online)
			expect((await participant.chatModel.room("default")).status)
				.equals(ChatStatus.Online)
		},
	},

	"messaging": {
		async "two participants can exchange messages"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()
			
			const p1 = await server.makeClientFor.participant()
			const p1room = await p1.chatModel.room(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const p2room = await p2.chatModel.room(roomLabel)

			p1room.post({content: "lol"})
			await nap()

			expect(p1room.posts.length).equals(1)
			expect(p1room.posts.find(post => post.content === "lol")).ok()
			expect(p2room.posts.find(post => post.content === "lol")).ok()

			p2room.post({content: "lmao"})
			await nap()

			expect(p1room.posts.find(post => post.content === "lmao")).ok()
			expect(p2room.posts.find(post => post.content === "lmao")).ok()

			expect(p1room.posts.length).equals(2)
			expect(p2room.posts.length).equals(2)
		},

		async "two participants in separate chats cannot exchange messages"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()
			const altRoomLabel = roomLabel + "2"

			const p1 = await server.makeClientFor.participant()
			const p1room = await p1.chatModel.room(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const p2room = await p2.chatModel.room(altRoomLabel)

			p1room.post({content: "lol"})
			await nap()
			expect(p1room.posts.find(post => post.content === "lol")).ok()
			expect(p2room.posts.find(post => post.content === "lol")).not.ok()

			p2room.post({content: "lmao"})
			await nap()
			expect(p1room.posts.find(post => post.content === "lmao")).not.ok()
			expect(p2room.posts.find(post => post.content === "lmao")).ok()

			expect(p1room.posts.length).equals(1)
			expect(p2room.posts.length).equals(1)
		},

		async "moderator can delete a message"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()

			const moderatorRoom = await moderator.chatModel.room(roomLabel)
			
			const p1 = await server.makeClientFor.participant()
			const p1room = await p1.chatModel.room(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const p2room = await p2.chatModel.room(roomLabel)

			p1room.post({content: "lol"})
			await nap()

			expect(p1room.posts.length).equals(1)
			expect(p2room.posts.length).equals(1)
			expect(moderatorRoom.posts.length).equals(1)

			const {postId} = moderatorRoom.posts[0]
			moderatorRoom.remove([postId])
			await nap()

			expect(p1room.posts.length).equals(0)
			expect(p2room.posts.length).equals(0)
			expect(moderatorRoom.posts.length).equals(0)
		},

		async "moderator can clear all messages in a room"() {},
	},

	"mutes and bans": {
		async "moderator can mute a participant, and unmute"() {},
		async "muted user cannot post messages"() {},
		async "muted user knows they are muted"() {},
		async "banned user cannot post messages"() {},
		async "muted user knows they are banned"() {},
	},

	"auth and timings": {
		async "user is unsubscribed from a room when the 'component' leaves"() {},
		async "user who logs out mid-chat is disconnected"() {},
		async "user who gains participation privilege mid-chat can send a message"() {},
		async "user who gains moderator privilege mid-chat can set chat status offline"() {},
	},

	"rate limiting": {
		async "user cannot flood 5 messages in quick succession"() {},
		async "user who floods chat recieves an error notice to slow down"() {},
	},
}
