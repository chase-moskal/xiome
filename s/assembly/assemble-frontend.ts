
import {Rando} from "../toolbox/get-rando.js"
import {makeCoreModel} from "../features/core/core-model.js"

import {BackendSystems} from "./assembly-types.js"

export async function assembleFrontend({rando, backend}: {
		rando: Rando
		backend: BackendSystems
	}) {

	const {coreApi} = backend

	return {
		models: {
			core: makeCoreModel({coreApi}),
			// pay: {},
			// videos: {},
			// questions: {},
		},
	}
}
