
import {AccessPayload} from "../../features/auth2/types/auth-tokens.js"

export function modelDataInitializationWidget({load, reset}: {
		load: () => Promise<void>
		reset: () => void
	}) {

	let loggedIn = false
	let usedInDom = false

	function performLoadWhenCircumstancesAreFavorable() {
		if (loggedIn && usedInDom)
			load()
		else
			reset()
	}

	return {
		indicateDomUsage() {
			if (!usedInDom) {
				usedInDom = true
				performLoadWhenCircumstancesAreFavorable()
			}
		},
		accessChange(access: AccessPayload) {
			const status = !!access
			if (loggedIn !== status) {
				loggedIn = status
				performLoadWhenCircumstancesAreFavorable()
			}
		},
	}
}
