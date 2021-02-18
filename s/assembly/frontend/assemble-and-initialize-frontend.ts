
import {ToRemote} from "renraku/x/types/remote/to-remote"

import {getComponents} from "./get-components.js"
import {assembleModels} from "./assemble-models.js"
import {SystemApi} from "../backend/types/system-api.js"
import {AuthGoblin} from "../../features/auth/goblin/types/auth-goblin.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./auth/login-with-link-token-or-use-existing-login.js"
import {installModalSystem} from "./modal/install-modal-system.js"

export async function assembleAndInitializeFrontend({authGoblin, remote}: {
		authGoblin: AuthGoblin
		remote: ToRemote<SystemApi>
	}) {

	const {modals, modalsElement} = installModalSystem()

	const models = await assembleModels({
		modals,
		remote,
		authGoblin,
	})

	const components = getComponents(models)

	await loginWithLinkTokenOrUseExistingLogin({
		authModel: models.authModel,
		link: window.location.toString(),
	})

	return {components, models, modalsElement}
}
