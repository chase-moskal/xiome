
import {getComponents} from "./get-components.js"
import {assembleModels} from "./assemble-models.js"
import {SystemApi} from "../backend/types/system-api.js"
import {ToRemote} from "renraku/x/types/remote/to-remote.js"
import {setupModalSystem} from "./modal/setup-modal-system.js"
import {AuthGoblin} from "../../features/auth/goblin/types/auth-goblin.js"
import {SystemPopups} from "./connect/system-popups/types/system-popups.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./auth/login-with-link-token-or-use-existing-login.js"
import {simpleFlexStorage} from "../../toolbox/flex-storage/simple-flex-storage.js"

export async function assembleAndInitializeFrontend({
		appId, popups, authGoblin, remote,
	}: {
		appId: string
		popups: SystemPopups
		authGoblin: AuthGoblin
		remote: ToRemote<SystemApi>
	}) {

	const storage = simpleFlexStorage(window.localStorage)

	const {modals, modalsElement} = setupModalSystem()
	const models = await assembleModels({
		appId,
		modals,
		remote,
		popups,
		storage,
		authGoblin,
	})

	const components = getComponents({models, modals})

	await loginWithLinkTokenOrUseExistingLogin({
		authModel: models.authModel,
		link: window.location.toString(),
	})

	return {components, models, modals, modalsElement}
}
