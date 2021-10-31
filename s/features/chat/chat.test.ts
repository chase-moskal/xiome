
import {Suite} from "cynic"
import {testChatSetup} from "./testing/test-chat-setup.js"

export default<Suite>{

	async "client can connect and receive initial chat status message"() {
		const setup = await testChatSetup()
		const server = await setup.makeServer()
		const client = await server.makeClient()
	},
}
