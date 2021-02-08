
import {makeRemote} from "./make-remote.js"
import {XiomeConfigConnected} from "./types/xiome-config-connected.js"
import {makeTokenStore2} from "../../features/auth/goblin/token-store2.js"

export async function connect({
		appId,
		apiOrigin = "https://api.xiome.io",
	}: XiomeConfigConnected) {

	const apiLink = apiOrigin + "/"
	const channel = new BroadcastChannel("tokenChangeEvent")
	const broadcast = () => channel.postMessage(undefined)
	const tokenStore = makeTokenStore2({
		appId,
		storage: window.localStorage,
		publishAppTokenChange: broadcast,
		publishAuthTokenChange: broadcast,
	})

	const {remote, authGoblin} = makeRemote({
		appId,
		apiLink,
		tokenStore,
	})

	channel.onmessage = authGoblin.refreshFromStorage

	return {remote, authGoblin}
}
