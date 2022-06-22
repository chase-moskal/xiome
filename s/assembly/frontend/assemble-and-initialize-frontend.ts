
import * as renraku from "renraku"
import {FlexStorage} from "dbmage"

import {SystemApi} from "../backend/types/system-api.js"
import {assembleModels} from "./models/assemble-models.js"
import {getComponents} from "./components/get-components.js"
import {setupModalSystem} from "./modal/setup-modal-system.js"
import {StorePopups} from "../../features/store2/models/types.js"
import {ChatConnect} from "../../features/chat/common/types/chat-concepts.js"
import {AuthMediator} from "../../features/auth/mediator/types/auth-mediator.js"
import {AccessLoginExpiredError} from "../../features/auth/aspects/users/models/errors/access-errors.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./auth/login-with-link-token-or-use-existing-login.js"

export async function assembleAndInitializeFrontend({
		appId, storePopups, storage, authMediator, remote, chatConnect,
	}: {
		appId: string
		storePopups: StorePopups
		storage: FlexStorage
		remote: renraku.Remote<SystemApi>
		authMediator: AuthMediator
		chatConnect: ChatConnect
	}) {

	const {modals, modalsElement} = setupModalSystem()
	const models = await assembleModels({
		appId,
		remote,
		storePopups,
		storage,
		authMediator,
		chatConnect,
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

	return {appId, components, models, modals, modalsElement}
}
