
import {AppDraft} from "../../../../auth-types.js"
import {FormState} from "../../form/types/form-state.js"
import {formEventHandlers} from "../../form/form-event-handlers.js"

export interface AppState {
	formState: FormState<AppDraft>
	formEventHandlers: ReturnType<typeof formEventHandlers>
}
