
import {makeEditorState} from "../../helpers/editor-state.js"
import {QuestionsBoardModel} from "../../../../model/types/board-model.js"
import {strongRecordKeeper} from "../../../../../../toolbox/record-keeper.js"
import {XioTextInput} from "../../../../../xio-components/inputs/xio-text-input.js"

export function makeAnswerEditorGetter({
		requestUpdate, getBoardModel, getTextInput,
	}: {
		requestUpdate: () => void
		getBoardModel: () => QuestionsBoardModel
		getTextInput: (questionId: string) => XioTextInput
	}) {

	const getRecord = strongRecordKeeper<string>()(questionId => {
		const state = makeEditorState()
		state.subscribe(requestUpdate)

		const resetEditor = () => {
			const input = getTextInput(questionId)
			input.text = ""
		}

		return {
			state: state.readable,
			actions: state.actions,
			subscribe: state.subscribe,
			submitAnswer: async() => {
				const {draftText} = state.readable
				resetEditor()
				state.actions.toggleEditMode()
				await getBoardModel().postAnswer(questionId, {content: draftText})
			},
		}
	})

	return (questionId: string) => getRecord(questionId)
}
