
import {AppDraft} from "../../../../auth-types.js"
import {dedupe} from "../../../../../../toolbox/dedupe.js"

export function joinHomeToOrigins(appDraft: AppDraft) {
	let homeOrigin: string
	try { homeOrigin = new URL(appDraft.home).origin }
	catch (error) {}
	return {
		...appDraft,
		origins: dedupe([
			homeOrigin,
			...appDraft.origins,
		])
	}
}
