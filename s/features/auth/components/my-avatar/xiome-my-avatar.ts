
import styles from "./xiome-my-avatar.css.js"
import {AuthModel} from "../../models/types/auth/auth-model.js"
import {Component2WithShare, html, mixinStyles, property} from "../../../../framework/component2/component2.js"

import svgSilhouette from "../../../../framework/icons/silhouette.svg.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends Component2WithShare<{authModel: AuthModel}> {

	@property({type: Boolean, reflect: true})
	"logged-in": boolean = false

	// autorun() {
	// 	this["logged-in"] = !!this.share.authModel.accessLoadingView.payload
	// }

	render() {
		return html`
			<div class=avatar>
				${svgSilhouette}
			</div>
		`
	}
}
