
import {onesie} from "../../../../toolbox/onesie.js"

export function makeActivator(action: () => Promise<void>) {

	let activated = false

	async function activate() {
		if (!activated) {
			activated = true
			await action()
		}
	}

	return {
		activate: onesie(activate),
		get alreadyActivated() { return activated },
		async refreshIfActivated() {
			if (activated)
				await action()
		},
	}
}
