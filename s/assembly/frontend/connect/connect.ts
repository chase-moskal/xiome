
import {makeRemote} from "../make-remote.js"
import {systemPopups} from "./system-popups/system-popups.js"
import {XiomeConfigConnected} from "../types/xiome-config-connected.js"
import {makeTokenStore2} from "../../../features/auth/goblin/token-store2.js"
import {simpleFlexStorage} from "../../../toolbox/flex-storage/simple-flex-storage.js"

export async function connect({
		appId,
		apiOrigin = "https://api.xiome.io",
		popupsBase = "https://xiome.io/popups"
	}: XiomeConfigConnected) {

	const apiLink = apiOrigin + "/"
	const channel = new BroadcastChannel("tokenChangeEvent")
	const broadcast = () => channel.postMessage(undefined)
	const tokenStore = makeTokenStore2({
		appId,
		storage: simpleFlexStorage(window.localStorage),
		publishAppTokenChange: broadcast,
		publishAuthTokenChange: broadcast,
	})

	const {remote, authGoblin} = makeRemote({
		appId,
		apiLink,
		tokenStore,
	})

	channel.onmessage = authGoblin.refreshFromStorage

	const popups = systemPopups({popupsBase})

	return {remote, authGoblin, popups}
}
