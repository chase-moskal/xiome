
import {happystate} from "../../../../toolbox/happystate/happystate.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"

function makeEditorState() {
	const {getState, actions} = happystate({
		state: {
			draftText: <string>"",
			isPostable: <boolean>false,
		},
		actions: state => ({
			handleValueChange(event: ValueChangeEvent<string>) {
				state.draftText = event.detail.value
			},
		}),
	})
}
