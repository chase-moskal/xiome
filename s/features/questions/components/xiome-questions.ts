
import styles from "./xiome-questions.css.js"
import {ops} from "../../../framework/ops.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {WiredComponent, mixinStyles, html, property} from "../../../framework/component.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {makeQuestionsModel} from "../model/questions-model.js"
import {QuestionsModel} from "../model/types/questions-model.js"
import {QuestionsBoardModel} from "../model/types/board-model.js"
// import {renderQuestion} from "./parts/render-question.js"

@mixinStyles(styles)
export class XiomeEcommerce extends WiredComponent<{
		modals: ModalSystem
		questionsModel: QuestionsModel
	}> {

	#boardModel: QuestionsBoardModel

	@property({type: String, reflect: true})
	board: string = "default"

	@property({type: String})
	draftText: string = ""

	firstUpdated() {
		this.#boardModel = this.share.questionsModel.makeBoardModel(this.board)
		this.#boardModel.loadQuestions()
	}

	// private renderQuestionsList() {
	// 	const boardOp = this.#boardModel.getBoardOp()
	// 	return renderOp(boardOp, () => {
	// 		const questions = this.#boardModel.getQuestions()
	// 		const {getUser, getAccess} = this.#boardModel
	// 		return html`
	// 			<ol>
	// 				${questions.map(question => html`
	// 					<li data-question-id="${question.questionId}">
	// 						${renderQuestion({
	// 							getUser,
	// 							question,
	// 							access: getAccess(),
	// 							handleLikeClick: () => console.log("like"),
	// 							handleUnlikeClick: () => console.log("unlike"),
	// 							handleDeleteClick: () => console.log("delete"),
	// 						})}
	// 					</li>
	// 				`)}
	// 			</ol>
	// 		`
	// 	})
	// }

	render() {
		return html``
		// const {ecommerce} = this.share
		// return ecommerce.userCanManageStore
		// 	? this.renderStoreManagement()
		// 	: html`
		// 		<p>you are not privileged to manage the store</p>
		// 	`
	}
}
