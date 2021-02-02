
import {formState} from "../../form/form-state.js"
import {TokenState} from "../types/token-state.js"
import {AppDisplay} from "../../../../types/apps/app-display.js"
import {formEventHandlers} from "../../form/form-event-handlers.js"
import {TokenManagerOptions} from "../types/token-manager-options.js"
import {XioTextInput} from "../../../../../xio-components/inputs/xio-text-input.js"
import {validateAppTokenDraft} from "../../../../topics/apps/validate-app-token-draft.js"

export function prepareTokenDepotForApp({
		root,
		createToken,
		requestUpdate,
	}: TokenManagerOptions) {

	const states = new WeakMap<AppDisplay, TokenState>()

	function obtainState(app: AppDisplay) {
		let state: TokenState = states.get(app)
		if (!state) {
			state = {form: formState()}
			states.set(app, state)
		}
		return state
	}

	return function tokenDepotForApp(app: AppDisplay) {
		const state = obtainState(app)
		function getFormElements() {
			const select = <X extends HTMLElement>(name: string) =>
				root.querySelector<X>(`.tokenmanager .token-${name}`)
			return {
				tokenLabel: select<XioTextInput>("label"),
				tokenOrigins: select<XioTextInput<string[]>>("origins"),
			}
		}
		const {handleFormChange, handleSubmitClick} = formEventHandlers({
			state: state.form,
			requestUpdate,
			submit: createToken,
			clearForm: () => {
				const {tokenLabel, tokenOrigins} = getFormElements()
				tokenLabel.setText("")
				tokenOrigins.setText("")
				requestUpdate()
			},
			readForm: () => {
				const {tokenLabel, tokenOrigins} = getFormElements()
				state.form.draft = {
					appId: app.appId,
					label: tokenLabel.value,
					origins: tokenOrigins.value,
				}
				state.form.problems = validateAppTokenDraft(state.form.draft)
				if (state.form.problems.length) state.form.draft = undefined
				requestUpdate()
			},
		})
		return {state, handleFormChange, handleSubmitClick}
	}
}
