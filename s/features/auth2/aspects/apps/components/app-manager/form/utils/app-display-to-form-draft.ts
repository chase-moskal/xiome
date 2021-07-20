
import {AppFormDraft} from "../types/app-form-draft.js"
import {originsMinusHome} from "./origins-minus-home.js"
import {AppDisplay} from "../../../../types/app-display.js"

export function appDisplayToFormDraft(display: AppDisplay): AppFormDraft {
	return {
		home: display.home,
		label: display.label,
		additionalOrigins: originsMinusHome(display.home, display.origins),
	}
}
