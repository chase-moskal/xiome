
import styles from "./zap-loading.css.js"
import {Component, html, mixinStyles, property} from "../../framework/component.js"

import {loading, LoadingView} from "../../toolbox/loading2.js"

 @mixinStyles(styles)
export class ZapLoading<xPayload = any> extends Component {

	 @property({type: Object})
	loadingView: LoadingView<xPayload> = loading<xPayload>().view

	render() {
		return this.loadingView.select({
			none: () => null,
			loading: () => html`<p class=loading>loading</p>`,
			error: reason => html`<p class=error>${reason ?? "error"}</p>`,
			ready: () => html`<slot></slot>`,
		})
	}
}
