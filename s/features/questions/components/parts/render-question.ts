
import {renderQuestionBody} from "./render-question-body.js"
import {User} from "../../../auth/aspects/users/types/user.js"
import {html} from "../../../../framework/component/component.js"
import {Question} from "../../api/types/questions-and-answers.js"

import heartSvg from "../../../../framework/icons/heart.svg.js"
import warningSvg from "../../../../framework/icons/warning.svg.js"
import heartFillSvg from "../../../../framework/icons/heart-fill.svg.js"
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

	const linkClick = (handle: () => void) => (event: MouseEvent) => {
		event.preventDefault()
		handle()
	}

	return html`
		<li class=question data-question-id="${question.questionId}">
			<div class=tophat>
				<xio-profile-card .user=${author} show-details></xio-profile-card>
			</div>
			<div class="bar bar1">
				<button
					data-vote=like
					?data-active=${question.liked}
					tabindex=0
					title="${voting.like.title}"
					@click=${voting.like.click}>
						<span>${voting.like.icon}</span>
						<span>${question.likes}</span>
				</button>
			</div>
			<div class=bubble>
				${renderQuestionBody({
					editable: false,
					content: question.content,
					timePosted: question.timePosted,
				})}
			</div>
			<div class="bar bar2">
				<button
					data-vote=report
					?data-active=${question.reported}
					tabindex=0
					title="${voting.report.title}"
					@click=${voting.report.click}>
						<span>${voting.report.icon}</span>
						<span>${question.reports}</span>
				</button>
				${authority
					? html`<a href="#" @click=${linkClick(handleDelete)}>delete</a>`
					: null}
			</div>
		</li>
	`
}
