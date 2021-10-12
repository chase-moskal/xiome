
import {IdentifiablePost, UniversalPostOptions} from "../types/post-options.js"
import {html, TemplateResult} from "../../../../../../../framework/component.js"

export function renderPostStructure({postOptions, bar1, bubble, bar2, buttonBar}: {
		postOptions: UniversalPostOptions & Partial<IdentifiablePost>
		bar1: TemplateResult
		bubble: TemplateResult
		bar2: TemplateResult
		buttonBar: TemplateResult
	}) {
	return html`
		<div class=post data-post-id="${postOptions.postId ?? ""}">
			<div class=tophat>
				<xio-profile-card .user=${postOptions.author} show-details></xio-profile-card>
			</div>
			<div class="bar bar1">
				${bar1}
			</div>
			${bubble}
			<div class="bar bar2">
				${bar2}
			</div>
			${buttonBar
				? html`
					<div class=buttonbar>
						${buttonBar}
					</div>
				`
				: null}
		</div>
	`
}
