
import {Rando} from "../toolbox/get-rando.js"
import {BackendSystems} from "./assembly-types.js"

export async function assembleFrontend({backend}: {
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
			}
		}
	}
}
