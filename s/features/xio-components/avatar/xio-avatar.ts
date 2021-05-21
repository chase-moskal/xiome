
import {User} from "../../auth/types/user.js"
import svgSilhouette from "../../../framework/icons/silhouette.svg.js"
import {Component2, property, html, mixinStyles} from "../../../framework/component2/component2.js"

import styles from "./xio-avatar.css.js"

@mixinStyles(styles)
export class XioAvatar extends Component2 {

	@property({type: Object})
	user: User

	render() {
		const {user} = this
		const avatar = user?.profile.avatar
		return html`
			<div class=avatar ?data-logged-in=${!!user}>
				${avatar
					? html`<img src="${avatar}" alt=""/>`
					: svgSilhouette}
			</div>
		`
	}
}
