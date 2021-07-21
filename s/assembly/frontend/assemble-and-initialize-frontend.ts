
import {getComponents} from "./get-components.js"
import {assembleModels} from "./assemble-models.js"
import {Remote} from "renraku/x/types/remote/remote.js"
import {SystemApi} from "../backend/types/system-api.js"
import {setupModalSystem} from "./modal/setup-modal-system.js"
import {SystemPopups} from "./connect/system-popups/types/system-popups.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"
import {AuthMediator} from "../../features/auth/mediator/types/auth-mediator.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./auth/login-with-link-token-or-use-existing-login.js"

export async function assembleAndInitializeFrontend({
		appId, popups, storage, authMediator, remote,
	}: {
		appId: string
		popups: SystemPopups
		storage: FlexStorage
		authMediator: AuthMediator
		remote: Remote<SystemApi>
	}) {

	const {modals, modalsElement} = setupModalSystem()
	const models = await assembleModels({
		appId,
		remote,
		popups,
		storage,
		authMediator,
	})

	const components = getComponents({models, modals})

	await loginWithLinkTokenOrUseExistingLogin({
		accessModel: models.accessModel,
		link: window.location.toString(),
	})

	return {components, models, modals, modalsElement}
}
