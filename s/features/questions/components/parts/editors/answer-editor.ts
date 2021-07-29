
import {makeEditorState} from "../../helpers/editor-state.js"
import {QuestionsBoardModel} from "../../../model/types/board-model.js"
import {strongRecordKeeper} from "../../../../../toolbox/record-keeper.js"
import {happystate} from "../../../../../toolbox/happystate/happystate.js"
import {happyCombine} from "../../../../../toolbox/happystate/happy-combine.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"

export function makeAnswerEditorGetter({
		requestUpdate, getBoardModel, getTextInput,
	}: {
		requestUpdate: () => void
		getBoardModel: () => QuestionsBoardModel
		getTextInput: (questionId: string) => XioTextInput
	}) {

	const getRecord = strongRecordKeeper<string>()(questionId => {
		const editorHappy = makeEditorState()
		const answerHappy = happystate({
			state: {
				editMode: false,
			},
			actions: state => ({
				toggleEditMode() {
					state.editMode = !state.editMode
				},
			}),
		})
		const happy = happyCombine(editorHappy)(answerHappy).combine()
		happy.onStateChange(requestUpdate)

		const resetEditor = () => {
			const input = getTextInput(questionId)
			input.text = ""
		}

		return {
			...happy,
			submitAnswer: async() => {
				const {draftText} = happy.getState()
				resetEditor()
				happy.actions.toggleEditMode()
				await getBoardModel().postAnswer(questionId, {content: draftText})
			},
		}
	})

	return (questionId: string) => getRecord(questionId)
}
