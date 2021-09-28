
import styles from "./xiome-video-display.css.js"
import {VideoView} from "../../types/video-concepts.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomeVideoDisplay extends ComponentWithShare<{
		contentModel: ReturnType<typeof makeContentModel>
	}> {

	@property({type: String})
	label: string = "default"

	@property({type: Boolean})
	private controls: boolean = false

	get model() {
		return this.share.contentModel
	}

	async init() {
		await this.model.initialize(this.label)
	}

	#toggleControls = () => {
		this.controls = !this.controls
	}

	#renderView(view: VideoView) {
		const onDeleteClick = () => {
			this.model.deleteView(view.label)
		}
		return html`
			<div class="view">
				<p>label: ${view.label}</p>
				<p>provider: ${view.provider}</p>
				<p>type: ${view.type}</p>
				<p>id: ${view.id}</p>
				<button @click=${onDeleteClick}>delete view</button>
			</div>
		`
	}

	#selected: number = 0

	#renderViewCreator(label: string) {
		const {model} = this
		const onSelectChange = (event: InputEvent) => {
			const target = event.target as HTMLSelectElement
			this.#selected = parseInt(target.value)
		}
		const onCreateClick = () => {
			const content = model.catalog[this.#selected]
			model.setView({
				label,
				privileges: [],
				reference: {
					id: content.id,
					type: content.type,
					provider: content.provider,
				},
			})
		}
		return html`
			<p>create view</p>
			${renderOp(model.state.catalogOp, catalog => html`
				<select @change=${onSelectChange}>
					${catalog.map(({provider, type, title}, index) => html`
						<option value=${index}>${`${provider} ${type} ${title}`}</option>
					`)}
				</select>
				<button @click=${onCreateClick}>create view</button>
			`)}
		`
	}

	#renderControls() {
		const {model, label} = this
		const currentView = model.getView(label)
		const otherViews = model.views
			.filter(view => view.label !== label)
		return html`
			<h2>
				<span>video display controls</span>
				<button @click=${this.#toggleControls}>
					${this.controls ? "close" : "open"}
				</button>
			</h2>
			${this.controls ? html`
				<p>this view <em>"${label}"</em></p>
				${currentView
					? this.#renderView(currentView)
					: this.#renderViewCreator(label)}
				${otherViews.length
					? html`
						<p>all other views</p>
						<div class="otherviews">
							${otherViews.map(
								view => this.#renderView(view)
							)}
						</div>
					`
					: null}
			` : null}
		`
	}

	#renderShow() {
		const show = this.model.getShow(this.label)
		return show ? html`
			<p>show ${show.title}</p>
			<ul>
				<li>${show.id}</li>
				<li>${show.embed}</li>
			</ul>
		` : html`
			<p>no show</p>
		`
	}

	render() {
		return renderOp(this.model.state.accessOp, () => html`
			${this.model.allowance.canModerateVideos
				? this.#renderControls()
				: null}
			${this.#renderShow()}
		`)
	}
}
