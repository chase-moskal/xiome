
import {html, SVGTemplateResult} from "../../../../../../../framework/component.js"

export function renderVotingUnit({
		title,
		dataVote,
		voteCount,
		voteCasted,
		icon,
		castVote,
	}: {
		title: string
		dataVote: string
		voteCount: number
		voteCasted: boolean
		icon: SVGTemplateResult
		castVote?: (status: boolean) => void
	}) {

	const handleClick = castVote
		? voteCasted
			? () => castVote(false)
			: () => castVote(true)
		: () => {}

	return html`
		<button
			tabindex=0
			data-vote="${dataVote}"
			?data-active=${voteCasted}
			?disabled=${!castVote}
			title="${title}"
			@click=${handleClick}>
				<span>${icon}</span>
				<span>${voteCount}</span>
		</button>
	`
}
