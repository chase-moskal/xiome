
import styles from "./xio-example.css.js"
import {AutowatcherComponent, html, mixinStyles} from "../../../framework/component/component.js"

 @mixinStyles(styles)
export class XioExample extends AutowatcherComponent {
	render() {
		return html`
			<div class=example>
				<p>xio-example</p>
				<slot></slot>
			</div>
		`
	}
}
