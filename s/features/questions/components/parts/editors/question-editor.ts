
import {makeEditorState} from "../../helpers/editor-state.js"
import {QuestionsBoardModel} from "../../../model/types/board-model.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"

export function makeQuestionEditor({getBoardModel}: {
		getBoardModel: () => QuestionsBoardModel
	}) {
	const {actions, getState, onStateChange} = makeEditorState()
	onStateChange(() => {this.requestUpdate()})
	const getTextInput = (): XioTextInput => (
		this.shadowRoot.querySelector(".question-editor xio-text-input")
	)
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
				board: getBoardModel().getBoardName(),
				content: draftText,
			})
		},
	}
}
