
import {getRando} from "dbmage"
import {assert, expect, Suite} from "cynic"

import {nap} from "../../toolbox/nap.js"
import {ops} from "../../framework/ops.js"
import {testChatSetup} from "./testing/test-chat-setup.js"
import {ChatDraft, ChatStatus} from "./common/types/chat-concepts.js"
import {chatValidationTestSetup} from "./testing/chat-validation-test-setup.js"
import {chatPostCoolOff, chatRateLimitingInterval} from "./common/chat-constants.js"

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

		async "moderator can mute people, then unmute everybody"() {
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

			moderatorRoom.unmuteAll()
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

			expect(moderatorRoom.posts.length).equals(1)
			const {userId} = moderatorRoom.posts[0]
			moderatorRoom.mute(userId)
			await nap()

			expect(p1room.muted.length).equals(1)
			expect(moderatorRoom.muted.length).equals(1)
			expect(moderatorRoom.muted[0]).equals(userId)
			expect(p1room.weAreMuted).equals(true)

			p1room.post({content: "lmao"})
			await nap()
			expect(p1room.posts.length).equals(1)
			expect(moderatorRoom.posts.length).equals(1)
		},

		async "muted user cannot post after re-joining"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()
			const {room: moderatorRoom} = await moderator.chatModel.session(roomLabel)

			const p1 = await server.makeClientFor.participant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			p1room.post({content: "lol"})
			await nap()

			expect(moderatorRoom.posts.length).equals(1)
			const {userId} = moderatorRoom.posts[0]
			moderatorRoom.mute(userId)
			await nap()

			{
				const p2 = await p1.clone()
				const {room} = await p2.chatModel.session(roomLabel)
				room.post({content: "rofl"})
				await nap()
				assert(room.posts.length === 1, "muted user should not have been able to post")
			}
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

	"connection": {
		async "connection is only created when a room session is present"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()
			const {chatModel} = await server.makeClientFor.participant()
			expect(ops.value(chatModel.state.connectionOp)).not.ok()
			const session1 = await chatModel.session(roomLabel)
			expect(ops.value(chatModel.state.connectionOp)).ok()
		},
		async "connections die without sessions, re-established with new sessions"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()
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
	},

	"appraisal": {
		async "newly connected user is appraised of existing posts"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()

			const p1 = await server.makeClientFor.participant()
			{
				const {room} = await p1.chatModel.session(roomLabel)
				room.post({content: "lol"})
				await nap()
				expect(room.posts.length).equals(1)
			}

			{
				const p2 = await p1.clone()
				const {room} = await p2.chatModel.session(roomLabel)
				await nap()
				expect(room.posts.length).equals(1)
			}
		},
		async "newly connected user is appraised of muted users"() {
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

			{
				const p2 = await p1.clone()
				const {room} = await p2.chatModel.session(roomLabel)
				assert(room.weAreMuted, "user should still be muted")
			}
		},
	},

	"auth changes": {
		async "user who gains participation privilege mid-chat can send a message"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()
			const client = await server.makeClientFor.forbidden()

			const modSession = await moderator.chatModel.session(roomLabel)
			const session = await client.chatModel.session(roomLabel)

			session.room.post({content: "hello"})
			await nap()
			expect(modSession.room.posts.length).equals(0)

			await client.addPrivilege("participate in all chats")
			session.room.post({content: "hello"})
			await nap()
			expect(modSession.room.posts.length).equals(1)
		},
		async "user who gains moderator privilege mid-chat can set chat status offline"() {
			const setup = await testChatSetup()
			const {server, roomLabel, moderator} = await setup.startOnline()
			const client = await server.makeClientFor.forbidden()

			const observerSession = await moderator.chatModel.session(roomLabel)
			const clientSession = await client.chatModel.session(roomLabel)

			clientSession.room.setRoomStatus(ChatStatus.Offline)
			await nap()
			expect(observerSession.room.status).equals(ChatStatus.Online)

			await client.addPrivilege("moderate all chats")
			clientSession.room.setRoomStatus(ChatStatus.Offline)
			await nap()
			expect(observerSession.room.status).equals(ChatStatus.Offline)
		},
	},

	"orchestration with persistence layer": {
		async "two chat servers are appraised of new chat posts"() {
			const setup = await testChatSetup()

			const {server: server1, roomLabel} = await setup.startOnline()
			const client1 = await server1.makeClientFor.participant()
			const {room: room1} = await client1.chatModel.session(roomLabel)

			const server2 = await setup.makeServer()
			const client2 = await server2.makeClientFor.participant()
			const {room: room2} = await client2.chatModel.session(roomLabel)

			room1.post({content: "hello"})
			await nap()

			expect(room1.posts.length).equals(1)
			expect(room2.posts.length).equals(1)
		},
	},

	"app isolation": {
		async "chat message in one app doesn't leak into other app"() {
			const setup = await testChatSetup()
			const rando = await getRando()
			const appId_a = rando.randomId().toString()
			const appId_b = rando.randomId().toString()
			const {server, roomLabel} = await setup.startOnline()
			
			const p1 = await server.makeClientFor.participant(appId_a)
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			const p2 = await server.makeClientFor.participant(appId_b)
			const {room: p2room} = await p2.chatModel.session(roomLabel)

			p1room.post({content: "lol"})
			await nap()

			expect(p1room.posts.length).equals(1)
			expect(p1room.posts.find(post => post.content === "lol")).ok()
			expect(p2room.posts.find(post => post.content === "lol")).not.ok()

			p2room.post({content: "lmao"})
			await nap()

			expect(p1room.posts.find(post => post.content === "lmao")).not.ok()
			expect(p2room.posts.find(post => post.content === "lmao")).ok()

			expect(p1room.posts.length).equals(1)
			expect(p2room.posts.length).equals(1)
		},
	},

	"rate limiting": {
		async "user cannot exceed rate limit"() {
			const setup = await testChatSetup()
			const {server, roomLabel} = await setup.startOnline()
			const p1 = await server.makeClientFor.participant()
			const {room: p1room} = await p1.chatModel.session(roomLabel)

			for (const x of [...Array(100).keys()])
				p1room.post({content: "lol"})

			await nap()
			const maximum = chatRateLimitingInterval / chatPostCoolOff
			assert(p1room.posts.length <= maximum, `should not be more than ${maximum} posts`)
		},
	},

	async "serverside validation"() {
		const setup = async() => (await chatValidationTestSetup(
			"view all chats",
			"moderate all chats",
			"participate in all chats",
		))

		const invalidStrict = {
			metas: [
				undefined,
			],
			rooms: [
				undefined,
				-99,
				"",
				"   ",
				"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
			],
			drafts: [
				undefined,
				{content: 123},
			],
			ids: [
				undefined,
				"abc",
				":",
				"    ",
				"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
			],
			statuses: [
				-99,
				5,
				"0",
				"lol",
			],
		}

		const invalid: {[P in keyof typeof invalidStrict]: any[]} = invalidStrict

		const rando = await getRando()
		const valid = {
			room: "default",
			id: rando.randomId().toString(),
			draft: <ChatDraft>{content: "hello test 123"},
			status: ChatStatus.Online,
		}

		async function expectValidationErrors<F extends (...args: any[]) => Promise<any>>(
				func: F,
				validArgs: Parameters<F>,
				invalidArgGroups: any[][],
			) {
			await func(...validArgs)
			await Promise.all(
				invalidArgGroups.map(
					async argGroup => {
						let threw = false
						try { await func(...argGroup) }
						catch (error) { threw = true }
						assert(
							threw,
							`validation failed, and let bad data through [${
								argGroup
									.map(
										x => x === undefined
											? "undefined"
											: JSON.stringify(x)
									).join(", ")
							}]`
						)
					}
				)
			)
		}

		return {
			"updateUserMeta validation": async() => {
				const {serverside, meta} = await setup()
				await expectValidationErrors(
					serverside.chatServer.updateUserMeta,
					[meta],
					invalid.metas.map(x => [x]),
				)
			},
			"roomSubscribe validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.roomSubscribe,
				[valid.room],
				invalid.rooms.map(x => [x]),
			),
			"roomUnsubscribe validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.roomUnsubscribe,
				[valid.room],
				invalid.rooms.map(x => [x]),
			),
			"post validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.post,
				[valid.room, valid.draft],
				[
					...invalid.rooms.map(x => [x, valid.draft]),
					...invalid.drafts.map(x => [x, valid.draft]),
				],
			),
			"remove validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.remove,
				[valid.room, [valid.id]],
				[
					...invalid.rooms.map(x => [x, [valid.id]]),
					...invalid.ids.map(x => [valid.room, [x]]),
					[valid.room, undefined],
					[valid.room, "lol"],
				]
			),
			"clear validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.clear,
				[valid.room],
				invalid.rooms.map(x => [x]),
			),
			"mute validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.mute,
				[[valid.id]],
				invalid.ids.map(x => [[x]]),
			),
			"unmute validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.unmute,
				[[valid.id]],
				invalid.ids.map(x => [[x]]),
			),
			"setRoomStatus validation": async() => await expectValidationErrors(
				(await setup()).serverside.chatServer.setRoomStatus,
				[valid.room, valid.status],
				[
					...invalid.rooms.map(x => [x, valid.status]),
					...invalid.statuses.map(x => [valid.room, x]),
				],
			),
		}
	},

	// // TODO
	// // currently, errors in the mocks will crash the "virtual server",
	// // as the mock system differs here from actual websocket server,
	// // which makes this test non-meaningful.
	// async "validation failure does not crash the server"() {
	// 	const setup = await testChatSetup()
	// 	const {server, roomLabel} = await setup.startOnline()

	// 	const p1 = await server.makeClientFor.participant()
	// 	const {room: p1room} = await p1.chatModel.session(roomLabel)

	// 	// cause a validation failure
	// 	const badSession = await p1.chatModel.session(<any>-99)
	// 	await nap()

	// 	const p2 = await server.makeClientFor.participant()
	// 	const {room: p2room} = await p2.chatModel.session(roomLabel)

	// 	p1room.post({content: "lol"})
	// 	await nap()

	// 	expect(p1room.posts.length).equals(1)
	// 	expect(p1room.posts.find(post => post.content === "lol")).ok()
	// 	expect(p2room.posts.find(post => post.content === "lol")).ok()

	// 	p2room.post({content: "lmao"})
	// 	await nap()

	// 	expect(p1room.posts.find(post => post.content === "lmao")).ok()
	// 	expect(p2room.posts.find(post => post.content === "lmao")).ok()

	// 	expect(p1room.posts.length).equals(2)
	// 	expect(p2room.posts.length).equals(2)
	// },
}
