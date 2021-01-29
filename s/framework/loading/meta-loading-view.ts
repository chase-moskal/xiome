
import {autorun} from "mobx"
import {loading} from "./loading.js"
import {LoadingView} from "./types/loading-view.js"

export function metaLoadingView({ subviews, errorReason }: {
		subviews: LoadingView<any>[]
		errorReason: string
	}): LoadingView<undefined> {

	const composite = loading<undefined>()

	autorun(() => {
		let allNone = true
		let allReady = true
		let anyError = false
		for (const sub of subviews) {
			allNone = allNone && sub.none
			allReady = allReady && sub.ready
			anyError = anyError || sub.error
		}
		if (allNone) composite.actions.setNone()
		else if (allReady) composite.actions.setReady(undefined)
		else if (anyError) composite.actions.setError(errorReason)
		else composite.actions.setLoading()
	})

	return composite.view
}
