
import * as renraku from "renraku"

import {assembleModels} from "../assembly/assemble-models.js"
import {assembleMetaMap} from "../assembly/assemble-meta-map.js"
import {assembleComponents} from "../assembly/assemble-components.js"

export function startup({apiUrl}: {apiUrl: string}) {
	const metaMap = assembleMetaMap()
	const remote = renraku.browserClient({url: apiUrl, metaMap})
	const models = assembleModels({remote})
	const components = assembleComponents({models})
	return {models, components}
}
