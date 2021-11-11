
import {assert, expect, Suite} from "cynic"

import {nap} from "../../toolbox/nap.js"
import {ops} from "../../framework/ops.js"
import {ChatStatus} from "./common/types/chat-concepts.js"
import {testChatSetup} from "./testing/test-chat-setup.js"

export default<Suite>{

	"room online/offline behavior": {
		async "viewer can find that a room starts offline"() {
			const setup = await testChatSetup()
			const server = await setup.makeServer()
			const {chatModel} = await server.makeClientFor.viewer()
			const {room} = await chatModel.session("default")

			assert(room.status === ChatStatus.Offline, "room should start offline")
		},

		async "moderator can and set a room online"() {
			const setup = await testChatSetup()
			const server = await setup.makeServer()
			const {chatModel} = await server.makeClientFor.moderator()
			const {room} = await chatModel.session("default")
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
			const {room: participantRoom} = await participant.chatModel.session("default")
			expect(participantRoom.status).equals(ChatStatus.Offline)
	
			// moderator sets room online

			const moderator = await server.makeClientFor.moderator()
			const {room: moderatorRoom} = await moderator.chatModel.session("default")
			expect(moderatorRoom.status).equals(ChatStatus.Offline)

			moderatorRoom.setRoomStatus(ChatStatus.Online)
			await nap()

			expect(moderatorRoom.status).equals(ChatStatus.Online)

			// participant sees it

			expect(participantRoom.status).equals(ChatStatus.Online)
			expect((await participant.chatModel.session("default")).room.status)
				.equals(ChatStatus.Online)
		},
	},

	"messaging": {
		async "two participants can exchange messages"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()
			
			const p1 = await server.makeClientFor.participant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const {room: p2room} = await p2.chatModel.session(roomLabel)

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
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const {room: p2room} = await p2.chatModel.session(altRoomLabel)

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

			const {room: moderatorRoom} = await moderator.chatModel.session(roomLabel)
			
			const p1 = await server.makeClientFor.participant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const {room: p2room} = await p2.chatModel.session(roomLabel)

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

		async "moderator can clear all messages in a room"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()

			const {room: moderatorRoom} = await moderator.chatModel.session(roomLabel)
			
			const p1 = await server.makeClientFor.participant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const {room: p2room} = await p2.chatModel.session(roomLabel)

			p1room.post({content: "lol"})
			p2room.post({content: "lmao"})
			p1room.post({content: "rofl"})
			moderatorRoom.post({content: "silence!"})
			await nap()

			expect(p1room.posts.length).equals(4)
			expect(p2room.posts.length).equals(4)
			expect(moderatorRoom.posts.length).equals(4)

			moderatorRoom.clear()
			await nap()

			expect(p1room.posts.length).equals(0)
			expect(p2room.posts.length).equals(0)
			expect(moderatorRoom.posts.length).equals(0)
		},
	},

	"mutes and bans": {
		async "moderator can mute a participant, and unmute"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()
			const {room: moderatorRoom} = await moderator.chatModel.session(roomLabel)

			const p1 = await server.makeClientFor.participant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)
			p1room.post({content: "lol"})
			await nap()

			const {userId} = moderatorRoom.posts[0]
			expect(moderatorRoom.posts.length).equals(1)
			moderatorRoom.mute(userId)
			await nap()

			expect(p1room.muted.length).equals(1)
			expect(moderatorRoom.muted.length).equals(1)
			expect(moderatorRoom.muted[0]).equals(userId)
			expect(p1room.weAreMuted).equals(true)

			moderatorRoom.unmute(userId)
			await nap()

			expect(p1room.muted.length).equals(0)
			expect(moderatorRoom.muted.length).equals(0)
			expect(p1room.weAreMuted).equals(false)
		},

		async "muted user cannot post messages"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()
			const {room: moderatorRoom} = await moderator.chatModel.session(roomLabel)

			const p1 = await server.makeClientFor.participant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			p1room.post({content: "lol"})
			await nap()

			const {userId} = moderatorRoom.posts[0]
			expect(moderatorRoom.posts.length).equals(1)
			moderatorRoom.mute(userId)
			await nap()

			expect(p1room.muted.length).equals(1)
			expect(moderatorRoom.muted.length).equals(1)
			expect(moderatorRoom.muted[0]).equals(userId)
			expect(p1room.weAreMuted).equals(true)

			p1room.post({content: "lmao"})
			await nap()
			expect(p1room.posts.find(post => post.content === "lmao")).not.ok()
		},

		async "banned user knows they are banned"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()

			const p1 = await server.makeClientFor.bannedParticipant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)
			expect(p1room.weAreBanned).equals(true)
		},

		async "banned user cannot post messages"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()

			const p1 = await server.makeClientFor.bannedParticipant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)
			expect(p1room.weAreBanned).equals(true)

			p1room.post({content: "rofl"})
			await nap()

			expect(p1room.posts.find(post => post.content === "rofl")).not.ok()
		},
	},

	"room subscription": {
		async "user is unsubscribed from a room when the 'component' leaves"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()

			const p1 = await server.makeClientFor.participant()
			const p1session = await p1.chatModel.session(roomLabel)

			const p2 = await server.makeClientFor.participant()
			const p2session = await p2.chatModel.session(roomLabel)

			p1session.room.post({content: "lol"})
			await nap()

			expect(p1session.room.posts.length).equals(1)
			expect(p1session.room.posts.find(post => post.content === "lol")).ok()
			expect(p2session.room.posts.find(post => post.content === "lol")).ok()

			p1session.dispose()

			p2session.room.post({content: "lmao"})
			await nap()

			expect(p2session.room.posts.length).equals(2)
			expect(p1session.room.posts.find(post => post.content === "lmao")).not.ok()
			expect(p1session.room.posts.length).equals(1)
		},
		async "rooms without sessions are unsubscribed"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()
			const {chatModel} = await server.makeClientFor.participant()

			const sessionOutside = await moderator.chatModel.session(roomLabel)
			const session1 = await chatModel.session(roomLabel)
			const session2 = await chatModel.session(roomLabel)

			sessionOutside.room.post({content: "lol1"})
			await nap()
			expect(session1.room.posts.length).equals(1)

			session2.dispose()
			await nap()
			sessionOutside.room.post({content: "lol2"})
			await nap()
			expect(session1.room.posts.length).equals(2)

			session1.dispose()
			await nap()
			sessionOutside.room.post({content: "lol3"})
			await nap()
			expect(session1.room.posts.length).equals(2)
		},
		async "connections die without sessions, re-established with new sessions"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()
			const {chatModel} = await server.makeClientFor.participant()

			const session1 = await chatModel.session(roomLabel)
			expect(ops.value(chatModel.state.connectionOp)).ok()
			
			const session2 = await chatModel.session(roomLabel)
			expect(ops.value(chatModel.state.connectionOp)).ok()

			session1.dispose()
			await nap()
			expect(ops.value(chatModel.state.connectionOp)).ok()

			session2.dispose()
			await nap()
			expect(ops.value(chatModel.state.connectionOp)).not.ok()

			const session3 = await chatModel.session(roomLabel)
			expect(ops.value(chatModel.state.connectionOp)).ok()

			session3.dispose()
			await nap()
			expect(ops.value(chatModel.state.connectionOp)).not.ok()
		},
	},

	"auth changes": {
		async "user who logs out mid-chat is disconnected"() {},
		async "user who gains participation privilege mid-chat can send a message"() {},
		async "user who gains moderator privilege mid-chat can set chat status offline"() {},
	},

	"rate limiting": {
		async "user cannot flood 5 messages in quick succession"() {},
		async "user who floods chat recieves an error notice to slow down"() {},
	},
}
