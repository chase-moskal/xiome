
import {makeRemote} from "../make-remote.js"
import {systemPopups} from "./system-popups/system-popups.js"
import {XiomeConfigConnected} from "../types/xiome-config-connected.js"
import {simpleFlexStorage} from "../../../toolbox/flex-storage/simple-flex-storage.js"

export async function connect({
		appId,
		apiOrigin = "https://api.xiome.io",
		platformOrigin = "https://xiome.io"
	}: XiomeConfigConnected) {

	const {remote, authMediator} = makeRemote({
		appId,
		apiLink: `${apiOrigin}/`,
		storage: simpleFlexStorage(window.localStorage),
	})
	
	const channel = new BroadcastChannel("tokenChangeEvent")
	authMediator.subscribeToAccessChange(() => channel.postMessage(undefined))
	channel.onmessage = () => authMediator.initialize()

	const popups = systemPopups({popupsBase: `${platformOrigin}/popups`})

	return {appId, remote, authMediator, popups}
}
