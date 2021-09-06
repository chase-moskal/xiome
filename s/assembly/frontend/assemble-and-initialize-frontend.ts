
import {Remote} from "renraku/x/types/remote/remote.js"

import {SystemApi} from "../backend/types/system-api.js"
import {assembleModels} from "./models/assemble-models.js"
import {getComponents} from "./components/get-components.js"
import {setupModalSystem} from "./modal/setup-modal-system.js"
import {SystemPopups} from "./connect/system-popups/types/system-popups.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"
import {AuthMediator} from "../../features/auth/mediator/types/auth-mediator.js"
import {AccessLoginExpiredError} from "../../features/auth/aspects/users/models/errors/access-errors.js"
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
		onError: error => {
			if (error instanceof AccessLoginExpiredError)
				modals.alert({
					title: "expired login link",
					body: "this login link has expired, please try again",
				})
			else
				modals.alert({
					title: "invalid login link",
					body: "something is wrong with this login link, please try again",
				})
		},
		onDone: () => {
			window.location.hash = ""
		},
	})

	return {components, models, modals, modalsElement}
}
