
import {makeRemote} from "./make-remote.js"
import {XiomeConfigConnected} from "./types/xiome-config-connected.js"
import {makeTokenStore2} from "../../features/auth/goblin/token-store2.js"

export async function connect({
		appToken,
		apiOrigin = "https://api.xiome.io",
	}: XiomeConfigConnected) {

	const apiLink = apiOrigin + "/"
	const channel = new BroadcastChannel("tokenChangeEvent")
	const tokenStore = makeTokenStore2({
		storage: window.localStorage,
		publishTokenChange: () => channel.postMessage(undefined),
	})

	const {remote, authGoblin} = makeRemote({
		appToken,
		apiLink,
		tokenStore,
	})

	channel.onmessage = authGoblin.refreshFromStorage

	return {remote, authGoblin}
}
