
import {AppCreatorState} from "../types/app-creator-state.js"
import {validateAppDraft} from "../../../../topics/apps/validate-app-draft.js"
import {XioTextInput} from "../../../../../xio-components/inputs/xio-text-input.js"

export function appCreatorFormOperations({state, root, requestUpdate}: {
		state: AppCreatorState
		root: ShadowRoot | HTMLElement
		requestUpdate: () => void
	}) {

	function getFormElements() {
		const select = <X extends HTMLElement>(name: string) =>
			root.querySelector<X>(`.app-creator .app-${name}`)
		return {
			appHome: select<XioTextInput>("home"),
			appLabel: select<XioTextInput>("label"),
			appOrigins: select<XioTextInput<string[]>>("origins"),
		}
	}

	function clearForm() {
		const {appHome, appLabel, appOrigins} = getFormElements()
		appHome.setText("")
		appLabel.setText("")
		appOrigins.setText("")
		requestUpdate()
	}

	function readForm() {
		const {appHome, appLabel, appOrigins} = getFormElements()
		state.appDraft = {
			home: appHome.value,
			label: appLabel.value,
			origins: appOrigins.value,
		}
		state.problems = validateAppDraft(state.appDraft)
		if (state.problems.length) state.appDraft = undefined
		requestUpdate()
	}

	return {clearForm, readForm}
}
