
import {renrakuMock} from "renraku"

import {SystemApi} from "../../backend/types/system-api.js"
import {prepareApiShape} from "../auth/prepare-api-shape.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export function mockRemote({
		api,
		appId,
		storage,
	}: {
		appId: string
		api: SystemApi
		storage: FlexStorage
	}) {

	const {metaMap, installAuthMediator} = prepareApiShape({
		appId,
		storage,
	})

	const remote = renrakuMock()
		.forApi(api)
		.withMetaMap(metaMap)

	const authMediator = installAuthMediator({
		greenService: remote.auth.users.greenService,
	})

	return {remote, authMediator}
}
