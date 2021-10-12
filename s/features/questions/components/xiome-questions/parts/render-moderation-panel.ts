
import {html} from "../../../../../framework/component.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export function renderModerationPanel({modals, board, archiveBoard}: {
		board: string
		modals: ModalSystem
		archiveBoard: () => Promise<void>
	}) {

	const handlePressPurgeButton = async() => {
		const confirmed = await modals.confirm({
			title: `Purge questions?`,
			body: `Are you sure you want to delete all the questions on the board "${board}"? This cannot be undone.`,
			yes: {vibe: "negative", label: "Purge all"},
			no: {vibe: "neutral", label: "Nevermind"},
			focusNthElement: 2,
		})
		if (confirmed)
			await archiveBoard()
	}

	return html`
		<div class=questions-moderation-panel>
			<h3>moderate questions board "${board}"</h3>
			<xio-button
				class=purge-button
				@press=${handlePressPurgeButton}>
					Purge all questions
			</xio-button>
		</div>
	`
}
