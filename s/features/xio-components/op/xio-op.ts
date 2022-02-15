
import styles from "./xio-op.css.js"
import {Op, ops} from "../../../framework/ops.js"
import svgWarning from "../../../framework/icons/warning.svg.js"
import svgSpinner from "../../../framework/icons/spinner.svg.js"
import {Component, html, mixinStyles, property} from "../../../framework/component.js"

@mixinStyles(styles)
export class XioOp<xPayload = any> extends Component {

	@property({type: String, reflect: true})
	mode: string = "none"

	private _op: Op<xPayload> = ops.none()

	get op() {
		return this._op
	}

	@property({type: Object})
	set op(op: Op<xPayload>) {
		const old = this._op
		this._op = op
		this.mode = ops.mode(op)
		this.requestUpdate("op", old)
	}

	@property()
	errorIcon = svgWarning

	@property()
	loadingIcon = svgSpinner

	@property({type: String})
	["loading-message"] = ""

	@property({type: String})
	["error-message"] = "error"

	@property({type: Boolean})
	["show-error-text"] = true

	@property({type: Boolean})
	["start-loading"]: boolean

	firstUpdated() {
		if (this["start-loading"]) {
			this.op = ops.loading()
		}
	}

	render() {
		return ops.select(this.op, {
			none: () => html`
				<slot name=none></slot>
			`,
			loading: () => html`
				<slot name=loading>
					${this.loadingIcon}
					${this["loading-message"]
						? html`<span>${this["loading-message"]}</span>`
						: null}
				</slot>
			`,
			error: reason => html`
				<slot name=error>
					${this.errorIcon}
					${this["show-error-text"]
						? html`<span>${reason ?? this["error-message"]}</span>`
						: null}
					
				</slot>
			`,
			ready: () => html`
				<slot></slot>
			`,
		})
	}
}
