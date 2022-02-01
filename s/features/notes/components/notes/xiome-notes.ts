
import styles from "./xiome-notes.css.js"

import {ops} from "../../../../framework/ops.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {Component, mixinStyles, html, mixinRequireShare} from "../../../../framework/component.js"
import {formatDuration} from "../../../../toolbox/goodtimes/format-duration.js"

@mixinStyles(styles)
export class XiomeNotes extends mixinRequireShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}>()(Component) {

	#model = this.share.notesModel
	#cacheDetails = this.share.notesModel.createNotesCacheDetails()
	#cache = this.#cacheDetails.cache

	async init() {
		await this.#model.initialize()
	}

	subscribe() {
		const unsubs = [
			super.subscribe(),
			this.#cacheDetails.setup(),
			this.#cache.subscribe(() => this.requestUpdate()),
		]
		if (this.#model.isLoggedIn) {
			this.#cache.fetchAppropriateNotes()
		}
		return () => unsubs.forEach(unsub => unsub())
	}

	#renderTabs() {
		const {old} = this.#cache.cacheState
		const {switchTabNew, switchTabOld} = this.#cache
		return html`
			<div class=tabs>
				<xio-button
					@press=${switchTabNew}
					data-tab="new"
					?data-active=${!old}>
						new
				</xio-button>
				<xio-button
					@press=${switchTabOld}
					data-tab="old"
					?data-active=${old}>
						old
				</xio-button>
			</div>
		`
	}

	#renderNotes() {
		const {old, notesOp} = this.#cache.cacheState
		const {markSpecificNoteNew, markSpecificNoteOld} = this.#cache
		return renderOp(notesOp, notes => html`
			<ol>
				${notes.map(note => html`
					<li>
						<header class="note-header">
							<p><strong>${note.type}</strong> ${formatDuration(note.time).days}</p>
							${old ? html`
								<xio-button @press=${() => markSpecificNoteNew(note.noteId)}>
									+
								</xio-button>
							` : html`
								<xio-button @press=${() => markSpecificNoteOld(note.noteId)}>
									x
								</xio-button>
							`}
						</header>
						<h1>${note.title}</h1>
					</li>
				`)}
			</ol>
		`)
	}

	#renderPagination() {
		const {pageNumber} = this.#cache.cacheState
		const {
			nextPage, previousPage,
			totalPages, isNextPageAvailable, isPreviousPageAvailable,
		} = this.#cache
		return html`
			${(isNextPageAvailable || isPreviousPageAvailable)
				? html`
				<xio-button
					?disabled=${!isPreviousPageAvailable}
					@press=${previousPage}>
						previous
				</xio-button>
				<span>
					${pageNumber} / ${totalPages}
				</span>
				<xio-button
					?disabled=${!isNextPageAvailable}
					@press=${nextPage}>
						next
				</xio-button>
				`
				: null
			}
		`
	}

	#renderButtonbar() {
		const {old} = this.#cache.cacheState
		const {markAllNotesOld} = this.#cache
		return html`
			<div class=buttonbar>
				${old
					? null
					: html`
						<xio-button @press=${markAllNotesOld}>
							mark all old
						</xio-button>
					`}
			</div>
		`
	}

	#renderBasedOnStateOfNotesArray (){
		const {old, notesOp} = this.#cache.cacheState
		return html`
			${ops.value(notesOp)?.length === 0
				? html`
					${this.#renderTabs()}
					<slot name="empty">
						you have no ${old ? 'old' : 'new'} notifications
					</slot>
				`
				: html`
					${this.#renderTabs()}
					${this.#renderNotes()}
					${this.#renderPagination()}
					${this.#renderButtonbar()}
				`}
		`
	}

	render() {
		return renderOp(this.#model.state.accessOp, access =>
			access?.user
				? html`
					${this.#renderBasedOnStateOfNotesArray()}
				`
				: html`
					<slot name="logged-out">
						you must be logged in to see your notifications
					</slot>
				`
		)
	}
}
