
import styles from "./zap-example.css.js"
import {Component, html, mixinStyles} from "../../framework/component.js"

 @mixinStyles(styles)
export class ZapExample extends Component {
	render() {
		return html`
			<div class=example>
				<p>zap-example</p>
				<slot></slot>
			</div>
		`
	}
}
