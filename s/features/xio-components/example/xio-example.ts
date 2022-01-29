
import styles from "./xio-example.css.js"
import {Component, html, mixinStyles} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioExample extends Component {
	render() {
		return html`
			<div class=example>
				<p>xio-example</p>
				<slot></slot>
			</div>
		`
	}
}
