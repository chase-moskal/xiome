
import {Suite} from "cynic"
import {ops} from "../../framework/ops.js"

import {getRando} from "../../toolbox/get-rando.js"
import {makeChatServelet} from "./api/make-chat-servelet.js"
import {prepareClientConnector} from "./api/prepare-client-connector.js"
import {makeChatModel} from "./models/chat-model.js"

export default<Suite>{

	async "client can connect"() {
		const rando = await getRando()
		const access = {
			appId: undefined,
			origins: [],
			permit: {privileges: []},
			scope: {core: false},
			user: {
				userId: rando.randomId().toString(),
				profile: {
					avatar: undefined,
					nickname: "nickname lol",
					tagline: "",
				},
				roles: [],
				stats: undefined,
			},
		}
		const servelet = makeChatServelet({
			policy: async({chat}) => ({chat, access})
		})
		const connectChatClient = prepareClientConnector({
			getAccessToken: async() => "a123",
			connectToServer: async({meta, handleDataFromServer}) => {
				const serverConnection = await servelet.acceptConnection({
					meta,
					close: () => {},
					sendDataToClient: handleDataFromServer,
				})
				return {
					sendDataToServer: handleDataFromServer,
					disconnect: async() => serverConnection.handleDisconnect(),
				}
			},
		})
		const model = makeChatModel({
			connectChatClient,
		})
		await model.updateAccessOp(ops.ready(access))
	},
}
