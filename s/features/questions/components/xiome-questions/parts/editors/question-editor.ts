
import {makeEditorState} from "../../helpers/editor-state.js"
import {QuestionsBoardModel} from "../../../../model/types/board-model.js"
import {XioTextInput} from "../../../../../xio-components/inputs/xio-text-input.js"

export function makeQuestionEditor({
		requestUpdate, getTextInput, getBoardModel,
	}: {
		requestUpdate: () => void
		getTextInput: () => XioTextInput
		getBoardModel: () => QuestionsBoardModel
	}) {

	const state = makeEditorState()
	state.subscribe(requestUpdate)

	const resetEditor = () => {
		const input = getTextInput()
		input.text = ""
	}

	return {
		state: state.readable,
		actions: state.actions,
		subscribe: state.subscribe,
		getTextInput,
		submitQuestion: async() => {
			const {draftText} = state.readable
			resetEditor()
			await getBoardModel().postQuestion({
				content: draftText,
			})
		},
	}
}
