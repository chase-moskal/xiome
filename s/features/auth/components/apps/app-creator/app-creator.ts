
import {formState} from "../form/form-state.js"
import {AppDraft} from "../../../../../types.js"
import {html} from "../../../../../framework/component.js"
import {formEventHandlers} from "../form/form-event-handlers.js"
import {validateAppDraft} from "../../../topics/apps/validate-app-draft.js"
import {appDraftValidators} from "../../../topics/apps/app-draft-validators.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"

export function makeAppCreator({root, requestUpdate, createApp}: {
		root: ShadowRoot | HTMLElement
		requestUpdate: () => void
		createApp: (appDraft: AppDraft) => Promise<void>
	}) {

	const state = formState<AppDraft>()

	function getFormElements() {
		const select = <X extends HTMLElement>(name: string) =>
			root.querySelector<X>(`.app-creator .app-${name}`)
		return {
			appHome: select<XioTextInput>("home"),
			appLabel: select<XioTextInput>("label"),
		}
	}

	const {handleFormChange, handleSubmitClick} = formEventHandlers({
		state,
		requestUpdate,
		submit: createApp,
		clearForm: () => {
			const {appHome, appLabel} = getFormElements()
			appHome.setText("")
			appLabel.setText("")
			requestUpdate()
		},
		readForm: () => {
			const {appHome, appLabel} = getFormElements()
			state.draft = {
				home: appHome.value,
				label: appLabel.value,
			}
			state.problems = validateAppDraft(state.draft)
			if (state.problems.length) state.draft = undefined
			requestUpdate()
		},
	})

	function render() {
		const {formDisabled, draft, problems} = state
		return html`
			<div class=app-creator>

				<xio-text-input
					class=app-label
					placeholder="app label"
					?disabled=${formDisabled}
					.validator=${appDraftValidators.label}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<xio-text-input
					class=app-home
					placeholder="app home"
					?disabled=${formDisabled}
					.validator=${appDraftValidators.home}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<button
					class=create-app-button
					?disabled=${formDisabled || !draft || problems.length > 0}
					@click=${handleSubmitClick}>
						create app
				</button>
			</div>
		`
	}

	return {render}
}
