
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

	const {actions, getState, onStateChange} = makeEditorState()
	onStateChange(requestUpdate)

	const resetEditor = () => {
		const input = getTextInput()
		input.text = ""
	}

	return {
		actions,
		getState,
		getTextInput,
		submitQuestion: async() => {
			const {draftText} = getState()
			resetEditor()
			await getBoardModel().postQuestion({
				content: draftText,
			})
		},
	}
}
