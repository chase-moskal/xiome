
import styles from "./xiome-video-views.css.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component.js"

import {renderView} from "../video-display/parts/controls/render-view.js"

@mixinStyles(styles)
export class XiomeVideoViews extends ComponentWithShare<{
		contentModel: ReturnType<typeof makeContentModel>
	}> {

	render() {
		const model = this.share.contentModel
		return model.allowance.canModerateVideos
			? renderOp(model.state.viewsOp, views => html`
				<slot>
					<h3>all video views</h3>
				</slot>
				${views.length ? html`
					<div class=views>
						${views.map(
							view => renderView({
								view,
								onDeleteClick: () => model.deleteView(view.label),
								getPrivilegeDisplay: id => model.getPrivilege(id),
							})
						)}
					</div>
				` : html`
					<slot name=no-views>
						<p>no video views are registered</p>
					</slot>
				`}
			`)
			: html`
				<slot name=unprivileged>
					<p>you don't have sufficient privileges to moderate video views</p>
				</slot>
			`
	}
}
