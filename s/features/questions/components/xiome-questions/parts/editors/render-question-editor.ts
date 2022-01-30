
import {renderPost} from "../post/render-post.js"
import {Op} from "../../../../../../framework/ops.js"
import {PostType} from "../post/types/post-options.js"
import {makeQuestionEditor} from "./question-editor.js"
import {AccessPayload} from "../../../../../auth/types/auth-tokens.js"
import {html} from "../../../../../../framework/component.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"

export function renderQuestionEditor({
		now, access, postingOp, questionEditor,
	}: {
		now: number
		access: AccessPayload
		postingOp: Op<void>
		questionEditor: ReturnType<typeof makeQuestionEditor>
	}) {
	const author = access?.user
	const editorState = questionEditor.state
	return renderOp(postingOp, () => html`
		<div class="editor question-editor" part=question-editor>
			<div class=intro>
				<p class=heading>Post a new question</p>
			</div>
			${renderPost({
				type: PostType.Editor,
				author,
				content: editorState.draftText,
				isPostable: editorState.isPostable,
				timePosted: now,
				postButtonText: "post question",
				submitPost: questionEditor.submitQuestion,
				changeDraftContent: questionEditor.actions.handleValueChange,
			})}
		</div>
	`)
}
