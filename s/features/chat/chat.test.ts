
import {Suite} from "cynic"

import {getRando} from "../../toolbox/get-rando.js"
import {AnonAuth} from "../auth/types/auth-metas.js"
import {makeChatServelet} from "./api/make-chat-servelet.js"
import {prepareClientConnector} from "./api/prepare-client-connector.js"

export default<Suite>{

	async "client can connect"() {
		const rando = await getRando()
		const servelet = makeChatServelet({
			rando,
			policy: async(meta) => ({
				chat: meta.chat,
				access: {
					appId: undefined,
					origins: [],
					permit: {privileges: []},
					scope: {core: false},
					user: {
						profile: {
							avatar: undefined,
							nickname: "nickname lol",
							tagline: "",
						},
						roles: [],
						stats: undefined,
						userId: rando.randomId().toString()
					},
				},
			})
		})
		const connectChatClient = prepareClientConnector({
			getAccessToken: async() => "a123",
			connectToServer: async({meta, handleDataFromServer}) => {
				const serverConnection = await servelet.acceptConnection({
					meta,
					sendDataToClient: handleDataFromServer,
				})
				return {
					sendDataToServer: handleDataFromServer,
					disconnect: async() => serverConnection.handleDisconnect(),
				}
			},
		})
		const client = await connectChatClient({chat: "default"})
	},
}
