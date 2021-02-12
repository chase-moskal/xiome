
import {autorun} from "mobx"
import {loading} from "./loading.js"
import {LoadingView} from "./types/loading-view.js"

export function metaLoadingView(
		...subviews: LoadingView<any>[]
	): LoadingView<void> {

	const composite = loading<void>()

	autorun(() => {
		let allNone = true
		let allReady = true
		let anyError = false
		const reasons: string[] = []
		for (const sub of subviews) {
			allNone = allNone && sub.none
			allReady = allReady && sub.ready
			anyError = anyError || sub.error
			if (sub.error) reasons.push(sub.reason)
		}
		if (allNone) composite.actions.setNone()
		else if (allReady) composite.actions.setReady(undefined)
		else if (anyError) composite.actions.setError(reasons.join("; "))
		else composite.actions.setLoading()
	})

	return composite.view
}
