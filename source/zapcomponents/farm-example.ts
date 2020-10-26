
import styles from "./farm-example.css.js"
import {Component, html, mixinStyles} from "../framework/component.js"

@mixinStyles(styles)
export class FarmExample extends Component {
	render() {
		return html`
			farm example
			<slot></slot>
		`
	}
}
