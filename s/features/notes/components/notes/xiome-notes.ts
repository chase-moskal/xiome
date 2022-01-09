import styles from "./xiome-notes.css.js" 
import {makeNotesModel}	from "../../models/notes-model.js" 
import { renderOp }	from "../../../../framework/op-rendering/render-op.js" 
import {ComponentWithShare,	mixinStyles, html} from "../../../../framework/component.js" 
import { ops } from "../../../../framework/ops.js" 

@mixinStyles(styles)
export class XiomeNotes extends ComponentWithShare<{
	notesModel: ReturnType<typeof makeNotesModel> 
}>{#model = this.share.notesModel 
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
	return () => unsubs.forEach((unsub) => unsub()) 
	}

	#renderTabs() {
	const { old } = this.#cache.cacheState 
	const { switchTabNew, switchTabOld } = this.#cache 
		return html`
		<div class="tabs">
			<div class="tab-new">
				<xio-button @press=${switchTabNew} data-tab="new"?data-active=${!old}>
				NEW
				</xio-button>
			</div>
			<div class="tab-old">
				<xio-button @press=${switchTabOld} data-tab="old" ?data-active=${old}>
				OLD
				</xio-button>
			</div>
		</div>
` 
  }

	#renderNotes() {
	const { old, notesOp } = this.#cache.cacheState 
	const { markSpecificNoteNew, markSpecificNoteOld } = this.#cache 
	return renderOp(
	notesOp,(notes) => html`
		<ol>
		${notes.map(
		(note) => html`
			<li class="note-body">
			${old ? html`
					<xio-button visibility="visible" @press=${() => markSpecificNoteNew(note.noteId)}>
					+
					</xio-button>
				`
				: html`
					<xio-button visibility="invisible" @press=${() => markSpecificNoteOld(note.noteId)}>
					X
					</xio-button>
				`}
			<div class="typeandtime">
				<p class="note-type">${note.type}</p>
				<p class="note-time">Sent at ${note.time}</p>
			</div>
			<p class="note-title">${note.title}</p>
			<p class="note-text">${note.text}</p>
			<p>${note.from}</p>
			<p>${note.to}</p>
			<p>${note.details}</p>
			</li>
		`
		)}
	</ol>
	`
	) 
	}

	#renderPagination() {
    const { pageNumber } = this.#cache.cacheState 
    const {nextPage, previousPage, totalPages, isNextPageAvailable, isPreviousPageAvailable,
	} = this.#cache 
    return html`
      ${isNextPageAvailable || isPreviousPageAvailable
        ? html`
            <div class="page-container">
            	<xio-button ? disabled=${!isPreviousPageAvailable}@press=${previousPage}>
			  		previous
              	</xio-button>
              	<span> ${pageNumber} / ${totalPages} </span>
              	<xio-button ?disabled=${!isNextPageAvailable} @press=${nextPage}>
			  		next
				</xio-button>
            </div>
          `
		: null}
	` 
	}

	#renderButtonbar() {
	const { old } = this.#cache.cacheState 
	const { markAllNotesOld } = this.#cache 
	return html`
    	<div class="buttonbar">
        ${old ? null : 
			html`
              <xio-button @press=${markAllNotesOld}> mark all old </xio-button> 
			  `}
     	</div>
	` 
	}

  #renderBasedOnStateOfNotesArray() {
    const { old, notesOp } = this.#cache.cacheState 
    return html`
		${ops.value(notesOp)?.length === 0 
			? html`
			${this.#renderTabs()}
            <slot name="empty">
              you have no ${old ? "old" : "new"} notifications
            </slot>
          `
        : html`
			<div class="note-container">
				${this.#renderTabs()}
              	<div class="note-content-box">
                	${this.#renderNotes()} ${this.#renderPagination()}
            	</div>
            	${this.#renderButtonbar()}
            </div>
        `}
    ` 
  }

  render() {
    return renderOp(this.#model.state.accessOp, (access) =>
      access?.user
        ? html` ${this.#renderBasedOnStateOfNotesArray()} `
        : html`
            <slot name="logged-out">
              you must be logged in to see your notifications
            </slot>
          `
    ) 
  }
}
