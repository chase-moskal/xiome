
import heartSvg from "../../../../../framework/icons/heart.svg.js"
import warningSvg from "../../../../../framework/icons/warning.svg.js"
import heartFillSvg from "../../../../../framework/icons/heart-fill.svg.js"
import warningFillSvg from "../../../../../framework/icons/warning-fill.svg.js"

import {renderBubble} from "./bubble/render-bubble.js"
import {User} from "../../../../auth/aspects/users/types/user.js"
import {renderVotingUnit} from "./voting-unit/render-voting-unit.js"
import {Likeable, Reportable} from "../../../api/types/questions-and-answers.js"
import {html, TemplateResult} from "../../../../../framework/component/component.js"
import {ValueChangeEvent} from "../../../../xio-components/inputs/events/value-change-event.js"

export function renderPost({
		author, postId, content, timePosted, editable,
		likeable, reportable, buttonBar,
		handleDelete,
		handleValueChange,
	}: {
		author: User
		postId: string
		content: string
		timePosted: number
		editable: boolean
		children?: TemplateResult
		buttonBar?: TemplateResult
		likeable?: {handleLike: (status: boolean) => void} & Likeable
		reportable?: {handleReport: (status: boolean) => void} & Reportable
		handleDelete?: () => void
		handleValueChange?: (event: ValueChangeEvent<string>) => void
	}) {

	const linkClick = (handler: () => void) => (event: MouseEvent) => {
		event.preventDefault()
		handler()
	}

	return html`
		<div class=post data-post-id="${postId}">
			<div class=tophat>
				<xio-profile-card .user=${author} show-details></xio-profile-card>
			</div>
			<div class="bar bar1">
				${likeable
					? renderVotingUnit({
						dataVote: "like",
						icon: likeable.liked
							? heartFillSvg
							: heartSvg,
						title: likeable.liked
							? "unlike this post"
							: "like this post",
						voteCount: likeable.likes,
						voteCasted: likeable.liked,
						castVote: status => likeable.handleLike(status),
					})
					: null}
			</div>
			${renderBubble({
				editable,
				content,
				timePosted,
				handleValueChange,
			})}
			<div class="bar bar2">
				${reportable
					? renderVotingUnit({
						dataVote: "report",
						icon: reportable.reported
							? warningFillSvg
							: warningSvg,
						title: reportable.reported
							? "unlike this post"
							: "like this post",
						voteCount: reportable.reports,
						voteCasted: reportable.reported,
						castVote: status => reportable.handleReport(status),
					})
					: null}
				${handleDelete
					? html`<a href="#" @click=${linkClick(handleDelete)}>delete</a>`
					: null}
			</div>
			${buttonBar
				? html`<div class=buttonbar>${buttonBar}</div>`
				: null}
		</div>
	`
}
