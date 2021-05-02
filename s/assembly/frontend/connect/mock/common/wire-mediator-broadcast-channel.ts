
import {AuthMediator} from "../../../../../features/auth/mediator/types/auth-mediator.js"

export function wireMediatorBroadcastChannel(authMediator: AuthMediator) {
	const channel = new BroadcastChannel("tokenChangeEvent")
	authMediator.subscribeToTokenChange(() => channel.postMessage(undefined))
	channel.onmessage = () => authMediator.initialize()
}
