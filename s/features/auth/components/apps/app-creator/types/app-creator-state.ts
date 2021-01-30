
import {AppDraft} from "../../../../../../types.js"

export interface AppCreatorState {
	problems: string[]
	appDraft: AppDraft | undefined
	formDisabled: boolean
}
