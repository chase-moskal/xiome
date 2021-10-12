
import styles from "./xio-avatar.css.js"
import svgSilhouette from "../../../framework/icons/silhouette.svg.js"

import {getNiceColors} from "./helpers/get-nice-colors.js"
import {Component, property, html, mixinStyles} from "../../../framework/component.js"
import {XioAvatarBlankSpec, XioAvatarImageSpec, XioAvatarSimpleSpec, XioAvatarSpec} from "./types/xio-avatar-types.js"

@mixinStyles(styles)
export class XioAvatar extends Component {

	@property({type: Object})
	spec: XioAvatarSpec

	private renderBlankAvatar(spec: XioAvatarBlankSpec) {
		return html`
			<div class=avatar>
				${svgSilhouette}
			</div>
		`
	}

	private renderSimpleAvatar({value}: XioAvatarSimpleSpec) {
		const {color1, color2, color3} = getNiceColors(value)
		const style = `color: ${color1}; background: linear-gradient(to bottom right, ${color2}, ${color3});`
		return html`
			<div class=avatar style=${style}>
				${svgSilhouette}
			</div>
		`
	}

	private renderImageAvatar({link}: XioAvatarImageSpec) {
		return html`
			<div class=avatar>
				<img src="${link}" alt=""/>
			</div>
		`
	}

	render() {
		const {spec = {type: "blank"}} = this
		switch (spec.type) {
			case "blank":
				return this.renderBlankAvatar(spec)
			case "simple":
				return this.renderSimpleAvatar(spec)
			case "image":
				return this.renderImageAvatar(spec)
			default:
				return html`avatar missing`
		}
	}
}
