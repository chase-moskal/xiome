
import {happystate} from "../../../../../toolbox/happystate/happystate.js"
import {ValueChangeEvent} from "../../../../xio-components/inputs/events/value-change-event.js"

export function makeEditorState() {
	return happystate({
		state: {
			draftText: <string>"",
			isPostable: <boolean>false,
		},
		actions: state => ({
			handleValueChange(event: ValueChangeEvent<string>) {
				state.draftText = event.detail.value
				state.isPostable = !!state.draftText
			},
		}),
	})
}
