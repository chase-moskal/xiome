
import {assert, Suite} from "cynic"
import {ChatStatus} from "./common/types/chat-concepts.js"
import {testChatSetup} from "./testing/test-chat-setup.js"

export default<Suite>{

	async "viewer can find that a room starts offline"() {
		const setup = await testChatSetup()
		const server = await setup.makeServer()
		const {chatModel} = await server.makeClientFor.viewer()
		const room = await chatModel.room("default")
		assert(room.status === ChatStatus.Offline, "room should start offline")
	},

	// async "moderator can and set a room online"() {
	// 	const setup = await testChatSetup()
	// 	const server = await setup.makeServer()
	// 	const {chatModel} = await server.makeClientFor.moderator()
	// 	const room = await chatModel.room("default")
	// 	assert(room.status === ChatStatus.Offline, "room should start offline")
	// 	room.setRoomStatus(ChatStatus.Online)
	// 	await room.waitMessages(1)
	// 	assert(room.status === ChatStatus.Online, "room should be online")
	// },

	// async "participant can receive their own message"() {
	// 	const setup = await testChatSetup()
	// 	const server = await setup.makeServer()
	// 	{
	// 		const {chatModel} = await server.makeClientFor.moderator()
	// 		const room = await chatModel.room("default")
	// 		room.setRoomStatus(ChatStatus.Online)
	// 		await room.waitMessages(1)
	// 	}
	// 	{
	// 		const {chatModel} = await server.makeClientFor.participant()
	// 		const room = await chatModel.room("default")
	// 		assert(room.status === ChatStatus.Online, "room should be online")
	// 	}
	// },
}
