
import * as renraku from "renraku"

import {assembleModels} from "../assembly/assemble-models.js"
import {assembleMetaMap} from "../assembly/assemble-meta-map.js"
import {assembleServices} from "../assembly/assemble-services.js"
import {assembleComponents} from "../assembly/assemble-components.js"

export function startupMock() {
	const api = assembleServices()
	const metaMap = assembleMetaMap()
	const remote = renraku.mock()
		.forApi(api)
		.withMetaMap(metaMap)
	const models = assembleModels({remote})
	const components = assembleComponents({models})
	return {models, components}
}
