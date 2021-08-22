
import "broadcastchannel-polyfill"
import {AuthMediator} from "../../../../../features/auth/mediator/types/auth-mediator.js"

type TokenChangeMessage = {
	appId: string
}

export function wireMediatorBroadcastChannel({appId, authMediator}: {
		appId: string
		authMediator: AuthMediator
	}) {
	const channel = new BroadcastChannel("tokenChangeEvent")
	authMediator.subscribeToTokenChange(() => channel.postMessage(<TokenChangeMessage>{appId}))
	channel.onmessage = (event: MessageEvent<TokenChangeMessage>) => {
		if (event.data.appId === appId)
			authMediator.initialize()
	}
}
