
import {Rando} from "../toolbox/get-rando.js"
import {BackendSystems} from "./assembly-types.js"

import {User} from "../types.js"

export async function assembleFrontend({rando, backend}: {
		rando: Rando
		backend: BackendSystems
	}) {
	let u = false
	return {
		models: {
			core: {
				get user() {return u},
				async login() {u=true},
				async logout() {u=false},
			},
			pay: {},
			videos: {},
		}
	}
}
