
import {makeEditorState} from "../../helpers/editor-state.js"
import {QuestionsBoardModel} from "../../../model/types/board-model.js"
import {strongRecordKeeper} from "../../../../../toolbox/record-keeper.js"
import {happystate} from "../../../../../toolbox/happystate/happystate.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"

export function makeAnswerEditorGetter({getBoardModel}: {
		getBoardModel: () => QuestionsBoardModel
	}) {

	const getRecord = strongRecordKeeper<string>()(questionId => {
		const editorBasics = makeEditorState()
		const answerSpecifics = happystate({
			state: {
				editMode: false,
			},
			actions: state => ({
				toggleEditMode() {
					state.editMode = !state.editMode
				},
			}),
		})
		editorBasics.onStateChange(() => {this.requestUpdate()})
		answerSpecifics.onStateChange(() => {this.requestUpdate()})
		const actions = {
			...editorBasics.actions,
			...answerSpecifics.actions,
		}
		const getState = () => ({
			...editorBasics.getState(),
			...answerSpecifics.getState(),
		})
		const getTextInput = (): XioTextInput => (
			this.shadowRoot.querySelector(
				`.questionslist li[data-question-id="${questionId}"] xio-text-input`
			)
		)
		const resetEditor = () => {
			const input = getTextInput()
			input.text = ""
		}
		return {
			actions,
			getState,
			getTextInput,
			submitAnswer: async() => {
				const {draftText} = getState()
				resetEditor()
				actions.toggleEditMode()
				await getBoardModel().postAnswer(questionId, {content: draftText})
			},
		}
	})

	return (questionId: string) => getRecord(questionId)
}
