
import styles from "./xio-example.css.js"
import {Component2, html, mixinStyles} from "../../../framework/component2/component2.js"

 @mixinStyles(styles)
export class XioExample extends Component2 {
	render() {
		return html`
			<div class=example>
				<p>xio-example</p>
				<slot></slot>
			</div>
		`
	}
}
