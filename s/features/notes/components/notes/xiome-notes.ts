
import styles from "./xiome-notes.css.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"
import {ops} from "../../../../framework/ops.js"

@mixinStyles(styles)
export class XiomeNotes extends ComponentWithShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}> {

	#model = this.share.notesModel
	#cacheDetails = this.share.notesModel.createNotesCacheDetails()
	#cache = this.#cacheDetails.cache

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
						<p>noteId: ${note.noteId}</p>
						<p>noteTitle: ${note.title}</p>
						<p>noteText: ${note.text}</p>
						<p>noteTime: ${note.time}</p>
						<p>noteFrom: ${note.from}</p>
						<p>noteTo: ${note.to}</p>
						<p>noteDetails: ${note.details}</p>
						<p>noteType: ${note.type}</p>
						${old ? html`
							<xio-button @press=${() => markSpecificNoteNew(note.noteId)}>
								+
							</xio-button>
						` : html`
							<xio-button @press=${() => markSpecificNoteOld(note.noteId)}>
								x
							</xio-button>
						`}
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
