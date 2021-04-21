
import styles from "./xio-loading.css.js"
import {Op, ops} from "../../../framework/ops.js"
import svgWarning from "../../../framework/icons/warning.svg.js"
import svgSpinner from "../../../framework/icons/spinner.svg.js"
import {Component, html, mixinStyles, property} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioOp<xPayload = any> extends Component {

	@property({type: Object})
	op: Op<xPayload> = ops.none()

	@property()
	errorIcon = svgWarning

	@property()
	loadingIcon = svgSpinner

	@property({type: String})
	["loading-message"] = "loading..."

	@property({type: String})
	["error-message"] = "error"

	render() {
		return ops.select(this.op, {
			none: () => html`
				<slot name=none></slot>
			`,
			loading: () => html`
				<slot name=loading>
					${this.loadingIcon}
					<span>${this["loading-message"]}</span>
				</slot>
			`,
			error: reason => html`
				<slot name=error>
					${this.errorIcon}
					<span>${reason ?? this["fallbackErrorMessage"]}</span>
				</slot>
			`,
			ready: () => html`
				<slot></slot>
			`,
		})
	}
}
