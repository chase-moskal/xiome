
import {AppState} from "./types/app-state.js"
import {AppDisplay} from "../../../types/apps/app-display.js"

import {formState} from "../form/form-state.js"
import {formEventHandlers} from "../form/form-event-handlers.js"
import { AppDraft } from "../../../auth-types.js"
import { joinHomeToOrigins } from "../app-creator/utils/join-home-to-origins.js"
import { validateAppDraft } from "../../../topics/apps/validate-app-draft.js"

export function makeAppStateManager({requestUpdate, submit}: {
		requestUpdate: () => void
		submit: (appId: string, appDraft: AppDraft) => Promise<void>
	}) {

	const states = new WeakMap<AppDisplay, AppState>()

	return function getAppState({app, getFormValues}: {
			app: AppDisplay
			getFormValues: () => AppDraft
		}): AppState {

		function makeNewState() {
			const fState = formState<AppDraft>()
			return {
				formState: fState,
				formEventHandlers: formEventHandlers({
					state: fState,
					requestUpdate,
					submit: () => submit(app.appId, fState.draft),
					clearForm: () => {},
					readAndValidateForm: () => {
						const appDraft = joinHomeToOrigins(getFormValues())
						fState.draft = appDraft
						fState.problems = validateAppDraft(appDraft)
						if (fState.problems.length) fState.draft = undefined
						requestUpdate()
					},
				}),
			}
		}

		let state: AppState
		if (states.has(app)) {
			state = states.get(app)
		}
		else {
			state = makeNewState()
			states.set(app, state)
		}
		return state
	}
}
