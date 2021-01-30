
import {AppDraft} from "../../../../../types.js"
import {html} from "../../../../../framework/component.js"
import {parseOrigins} from "../../../topics/apps/parse-origins.js"
import {appDraftValidators} from "../../../topics/apps/app-draft-validators.js"

import {AppCreatorState} from "./types/app-creator-state.js"
import {appCreatorEventHandlers} from "./preparations/app-creator-event-handlers.js"
import {appCreatorFormOperations} from "./preparations/app-creator-form-operations.js"

export function makeAppCreator({root, requestUpdate, createApp}: {
		root: ShadowRoot | HTMLElement
		requestUpdate: () => void
		createApp: (appDraft: AppDraft) => Promise<void>
	}) {

	const state: AppCreatorState = {
		problems: [],
		appDraft: undefined,
		formDisabled: false,
	}

	const {clearForm, readForm} = appCreatorFormOperations({
		requestUpdate,
		state,
		root,
	})

	const {handleFormChange, handleCreateClick} = appCreatorEventHandlers({
		requestUpdate,
		clearForm,
		createApp,
		readForm,
		state,
	})

	function render() {
		const {formDisabled, appDraft, problems} = state
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

				<xio-text-input
					textarea
					class=app-origins
					placeholder="app origins"
					?disabled=${formDisabled}
					.parser=${parseOrigins}
					.validator=${appDraftValidators.origins}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<button
					class=create-app-button
					?disabled=${formDisabled || !appDraft || problems.length > 0}
					@click=${handleCreateClick}>
						create app
				</button>
			</div>
		`
	}

	return {render}
}
