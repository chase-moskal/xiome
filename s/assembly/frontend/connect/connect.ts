
import {makeRemote} from "../make-remote.js"
import {systemPopups} from "./system-popups/system-popups.js"
import {XiomeConfig} from "../types/xiome-config-connected.js"
import {simpleFlexStorage} from "../../../toolbox/flex-storage/simple-flex-storage.js"
import {wireMediatorBroadcastChannel} from "./mock/common/wire-mediator-broadcast-channel.js"

export async function connect({
		appId,
		apiOrigin = "https://api.xiome.io",
		platformOrigin = "https://xiome.io"
	}: XiomeConfig) {

	const storage = simpleFlexStorage(window.localStorage)
	
	const {remote, authMediator} = makeRemote({
		appId,
		storage,
		apiLink: `${apiOrigin}/`,
	})

	wireMediatorBroadcastChannel({appId, authMediator})

	const popups = systemPopups({popupsBase: `${platformOrigin}/popups`})

	return {appId, remote, storage, authMediator, popups}
}
