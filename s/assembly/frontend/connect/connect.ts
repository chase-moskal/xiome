
import {makeRemote} from "../make-remote.js"
import {systemPopups} from "./system-popups/system-popups.js"
import {XiomeConfigConnected} from "../types/xiome-config-connected.js"
import {simpleFlexStorage} from "../../../toolbox/flex-storage/simple-flex-storage.js"
import {wireMediatorBroadcastChannel} from "./mock/common/wire-mediator-broadcast-channel.js"

export async function connect({
		id_app,
		apiOrigin = "https://api.xiome.io",
		platformOrigin = "https://xiome.io"
	}: XiomeConfigConnected) {

	const {remote, authMediator} = makeRemote({
		id_app,
		apiLink: `${apiOrigin}/`,
		storage: simpleFlexStorage(window.localStorage),
	})

	wireMediatorBroadcastChannel(authMediator)

	const popups = systemPopups({popupsBase: `${platformOrigin}/popups`})

	return {id_app, remote, authMediator, popups}
}
