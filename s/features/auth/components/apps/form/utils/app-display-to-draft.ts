
import {AppDraft} from "../../../../types/apps/app-draft.js"
import {originsMinusHome} from "./origins-minus-home.js"
import {AppDisplay} from "../../../../types/apps/app-display.js"

export function appDisplayToDraft(display: AppDisplay): AppDraft {
	return {
		home: display.home,
		label: display.label,
		origins: originsMinusHome(display.home, display.origins)
	}
}
