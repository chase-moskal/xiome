
import {snapstate} from "@chasemoskal/snapstate"
import {ValueChangeEvent} from "../../../../xio-components/inputs/events/value-change-event.js"

export function makeEditorState() {
	const state = snapstate({
		editMode: false,
		draftText: <string>"",
		isPostable: <boolean>false,
	})

	return {
		...state,
		actions: {
			toggleEditMode() {
				state.writable.editMode = !state.writable.editMode
			},
			handleValueChange(event: ValueChangeEvent<string>) {
				state.writable.draftText = event.detail.value
				state.writable.isPostable = !!state.writable.draftText
			},
		},
	}
}
