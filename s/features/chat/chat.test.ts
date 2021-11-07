
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
}
