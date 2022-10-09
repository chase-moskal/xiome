
import {simpleFlexStorage} from "dbmage"

import {makeRemote} from "./remote/make-remote.js"
import {XiomeConfig} from "../types/xiome-config-connected.js"
import {makeStripePopups} from "../../../features/store/popups/make-stripe-popups.js"
import {chatSocketClient} from "../../../features/chat/api/sockets/chat-socket-client.js"
import {wireMediatorBroadcastChannel} from "./mock/common/wire-mediator-broadcast-channel.js"

function url(platformOrigin: string) {
	return new URL(platformOrigin)
}

export async function connect({
		appId,
		platformOrigin = `https://xiome.io`,
		apiServer = `${url(platformOrigin).protocol}//api.${url(platformOrigin).host}/`,
		chatServer = `${
			url(platformOrigin).protocol === "https:"?
				"wss:":
				"ws:"
		}//chat.${url(platformOrigin).host}/`,
	}: XiomeConfig) {

	const storage = simpleFlexStorage(window.localStorage)
	const {remote, authMediator} = makeRemote({
		appId,
		storage,
		apiLink: apiServer,
	})
	wireMediatorBroadcastChannel({appId, authMediator})

	const stripePopups = makeStripePopups()

	const chatConnect = chatSocketClient(chatServer)
	return {appId, remote, storage, authMediator, stripePopups, chatConnect}
}
