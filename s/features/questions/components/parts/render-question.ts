
import {html} from "lit-html"
import {User} from "../../../auth/types/user.js"
import {Question} from "../../api/types/question.js"
import {renderQuestionBody} from "./render-question-body.js"
import heartSvg from "../../../../framework/icons/heart.svg.js"
import heartFillSvg from "../../../../framework/icons/heart-fill.svg.js"
import warningSvg from "../../../../framework/icons/warning.svg.js"
import warningFillSvg from "../../../../framework/icons/warning-fill.svg.js"

export function renderQuestion({
		author, authority, question,
		handleDelete, handleLike, handleReport,
	}: {
		author: User
		authority: boolean
		question: Question
		handleDelete: () => void
		handleLike: (like: boolean) => void
		handleReport: (report: boolean) => void
	}) {

	const voting = {
		like: question.liked
			? {
				icon: heartFillSvg,
				title: "unlike this post",
				click: () => handleLike(false),
			}
			: {
				icon: heartSvg,
				title: "like this post",
				click: () => handleLike(true),
			},
		report: question.reported
			? {
				icon: warningFillSvg,
				title: "unreport this post",
				click: () => handleReport(false),
			}
			: {
				icon: warningSvg,
				title: "report this post",
				click: () => handleReport(true),
			},
	}

	return html`
		<li data-question-id="${question.questionId}">
			<div class=question-expression>
				<div class=question-voting>
					<button
						data-vote=like
						?data-active=${question.liked}
						tabindex=0
						title="${voting.like.title}"
						@click=${voting.like.click}>
							<span>${voting.like.icon}</span>
							<span>${question.likes}</span>
					</button>
					<button
						data-vote=report
						?data-active=${question.reported}
						tabindex=0
						title="${voting.report.title}"
						@click=${voting.report.click}>
							<span>${voting.report.icon}</span>
							<span>${question.reports}</span>
					</button>
				</div>
				<div class=question-area>
					<xio-profile-card .user=${author} show-details></xio-profile-card>
					${renderQuestionBody({
						editable: false,
						content: question.content,
						timePosted: question.timePosted,
					})}
				</div>
			</div>
			<div class=question-controls>
				${authority
					? html`<xio-button @press=${handleDelete}>delete</xio-button>`
					: null}
			</div>
		</li>
	`
}
