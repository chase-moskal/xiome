
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
			root.querySelector<X>(`.appcreator .app-${name}`)
		return {
			appHome: select<XioTextInput>("home"),
			appLabel: select<XioTextInput>("label"),
		}
	}

	function clearForm() {
		const {appHome, appLabel} = getFormElements()
		appHome.setText("")
		appLabel.setText("")
		requestUpdate()
	}

	function readForm() {
		const {appHome, appLabel} = getFormElements()
		state.appDraft = {
			home: appHome.value,
			label: appLabel.value,
		}
		state.problems = validateAppDraft(state.appDraft)
		if (state.problems.length) state.appDraft = undefined
		requestUpdate()
	}

	return {clearForm, readForm}
}
