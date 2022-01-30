
import {renderPost} from "../post/render-post.js"
import {PostType} from "../post/types/post-options.js"
import {makeAnswerEditorGetter} from "./answer-editor.js"
import {html} from "../../../../../../framework/component.js"
import {QuestionsBoardModel} from "../../../../model/types/board-model.js"

export function renderAnswerEditor({
		now, boardModel, answerEditor,
	}: {
		now: number
		boardModel: QuestionsBoardModel
		answerEditor: ReturnType<ReturnType<typeof makeAnswerEditorGetter>>
	}) {

	const answerEditorState = answerEditor.state

	return html`
		<div class="editor answer-editor">
			<div class=intro>
				<p class=heading>Post your answer</p>
			</div>
			${renderPost({
				author: boardModel.getAccess().user,
				type: PostType.Editor,
				timePosted: now,
				postButtonText: "post answer",
				content: answerEditorState.draftText,
				isPostable: answerEditorState.isPostable,
				submitPost: answerEditor.submitAnswer,
				changeDraftContent: answerEditor.actions.handleValueChange,
			})}
		</div>
	`
}
