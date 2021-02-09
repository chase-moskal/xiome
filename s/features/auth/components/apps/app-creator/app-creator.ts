
import {formState} from "../form/form-state.js"
import {AppDraft} from "../../../../../types.js"
import {html} from "../../../../../framework/component.js"
import {getFormElements} from "./utils/get-form-elements.js"
import {formEventHandlers} from "../form/form-event-handlers.js"
import {joinHomeToOrigins} from "./utils/join-home-to-origins.js"
import {parseOrigins} from "../../../topics/apps/parse-origins.js"
import {validateAppDraft} from "../../../topics/apps/validate-app-draft.js"
import {appDraftValidators} from "../../../topics/apps/app-draft-validators.js"

export function makeAppCreator({root, requestUpdate, createApp}: {
		root: ShadowRoot | HTMLElement
		requestUpdate: () => void
		createApp: (appDraft: AppDraft) => Promise<void>
	}) {

	const state = formState<AppDraft>()

	const {handleFormChange, handleSubmitClick} = formEventHandlers({
		state,
		requestUpdate,
		submit: async draft => createApp(joinHomeToOrigins(draft)),
		clearForm: () => {
			const {appHome, appLabel, appOrigins} = getFormElements(root)
			appHome.setText("")
			appLabel.setText("")
			appOrigins.setText("")
			requestUpdate()
		},
		readAndValidateForm: () => {
			const {appHome, appLabel, appOrigins} = getFormElements(root)
			state.draft = joinHomeToOrigins({
				home: appHome.value,
				label: appLabel.value,
				origins: appOrigins.value,
			})
			state.problems = validateAppDraft(state.draft)
			if (state.problems.length) state.draft = undefined
			requestUpdate()
		},
	})

	function render() {
		const {formDisabled, draft, problems} = state
		return html`
			<div class=app-creator>
				<slot name=create-app-heading></slot>

				<xio-text-input
					class=app-label
					?disabled=${formDisabled}
					.validator=${appDraftValidators.label}
					@valuechange=${handleFormChange}>
						community label
				</xio-text-input>

				<xio-text-input
					class=app-home
					?disabled=${formDisabled}
					.validator=${appDraftValidators.home}
					@valuechange=${handleFormChange}>
						website homepage
				</xio-text-input>

				<xio-text-input
					textarea
					class=app-origins
					?disabled=${formDisabled}
					show-validation-when-empty
					.parser=${parseOrigins}
					.validator=${appDraftValidators.additionalOrigins}
					@valuechange=${handleFormChange}>
						additional origins (optional)
				</xio-text-input>

				<xio-button
					class="create-app-button"
					?disabled=${formDisabled || !draft || problems.length > 0}
					@press=${handleSubmitClick}>
						register community
				</xio-button>
			</div>
		`
	}

	return {render}
}
