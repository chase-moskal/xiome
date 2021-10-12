
import {renderBubble} from "./bubble/render-bubble.js"
import {linkClick} from "./post-structure/link-click.js"
import {AnyPost, PostType} from "./types/post-options.js"
import {renderLiking} from "./post-structure/render-liking.js"
import {renderReporting} from "./post-structure/render-reporting.js"
import {html} from "../../../../../../framework/component.js"
import {renderPostStructure} from "./post-structure/render-post-structure.js"

export function renderPost(options: AnyPost) {
	const {author, content, timePosted, ...specificOptions} = options
	switch (specificOptions.type) {

		case PostType.Question: {
			const {liking, reporting, deletePost, toggleAnswerEditor} = specificOptions
			return renderPostStructure({
				postOptions: options,
				bar1: html`
					${renderLiking(liking)}
				`,
				bubble: renderBubble({
					content,
					timePosted,
					editable: false,
					handleValueChange: undefined,
				}),
				bar2: html`
					${renderReporting(reporting)}
					${deletePost
						? html`<a href="#" @click=${linkClick(deletePost)}>delete</a>`
						: null}
					${toggleAnswerEditor
						? html`<a href="#" @click=${linkClick(toggleAnswerEditor)}>answer</a>`
						: null}
				`,
				buttonBar: undefined,
			})
		}

		case PostType.Answer: {
			const {liking, reporting, deletePost} = specificOptions
			return renderPostStructure({
				postOptions: options,
				bar1: html`
					${renderLiking(liking)}
				`,
				bubble: renderBubble({
					content,
					timePosted,
					editable: false,
					handleValueChange: undefined,
				}),
				bar2: html`
					${renderReporting(reporting)}
					${deletePost
						? html`<a href="#" @click=${linkClick(deletePost)}>delete</a>`
						: null}
				`,
				buttonBar: undefined,
			})
		}

		case PostType.Editor: {
			const {isPostable, postButtonText, changeDraftContent, submitPost} = specificOptions
			return renderPostStructure({
				postOptions: options,
				bar1: null,
				bubble: renderBubble({
					content,
					timePosted,
					editable: true,
					handleValueChange: changeDraftContent,
				}),
				bar2: null,
				buttonBar: html`
					<xio-button
						?disabled=${!isPostable}
						@click=${submitPost}
							>${postButtonText}</xio-button>
				`,
			})
		}
	}
}
