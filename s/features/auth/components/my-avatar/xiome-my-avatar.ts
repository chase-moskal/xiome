
import styles from "./xiome-my-avatar.css.js"
import {AuthModel} from "../../types/auth-model.js"
import {WiredComponent, html, mixinStyles, property, query, maybe} from "../../../../framework/component.js"

import svgSilhouette from "../../../../framework/icons/silhouette.svg.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends WiredComponent<{authModel: AuthModel}> {

	@property({type: Boolean, reflect: true})
	"logged-in": boolean = false

	autorun() {
		this["logged-in"] = !!this.share.authModel.accessLoadingView.payload
	}

	render() {
		return html`
			<div class=avatar>
				${svgSilhouette}
			</div>
		`
	}
}
