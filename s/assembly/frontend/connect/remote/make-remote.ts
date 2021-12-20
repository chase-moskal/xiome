
import {renrakuBrowserClient} from "renraku"

import {SystemApi} from "../../../backend/types/system-api.js"
import {prepareApiShape} from "../../auth/prepare-api-shape.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export function makeRemote({
		appId,
		apiLink,
		storage,
	}: {
		appId: string
		apiLink: string
		storage: FlexStorage
	}) {

	const {metaMap, installAuthMediator} = prepareApiShape({
		appId,
		storage,
	})

	const remote = renrakuBrowserClient<SystemApi>({
		metaMap,
		url: apiLink,
	})

	const authMediator = installAuthMediator({
		greenService: remote.auth.users.greenService,
	})

	return {remote, authMediator}
}
