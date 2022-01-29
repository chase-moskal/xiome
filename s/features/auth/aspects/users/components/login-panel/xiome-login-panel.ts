
import styles from "./xiome-login-panel.css.js"
import {Op, ops} from "../../../../../../framework/ops.js"
import {makeAccessModel} from "../../models/access-model.js"
import {email} from "../../../../../../toolbox/darkvalley.js"
import {AccessPayload} from "../../../../types/auth-tokens.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {XioTextInput} from "../../../../../xio-components/inputs/xio-text-input.js"
import {Component, html, mixinRequireShare, mixinStyles, property, query} from "../../../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeLoginPanel extends mixinRequireShare<{
		accessModel: ReturnType<typeof makeAccessModel>
	}>()(Component) {

	@property({type: Boolean, reflect: true})
	["show-logout"]: boolean = false

	@property({type: String, reflect: true})
	["status"]: "loading" | "logged-out" | "logged-in" = "loading"

	@property()
	private sentLoading: Op<{email: string}> = ops.none()

	@query("xio-text-input")
	private textInput: XioTextInput

	@property({type: String})
	private emailIsValid = false

	private async sendEmail() {
		const email = this.textInput.value
		await ops.operation({
			promise: this.share.accessModel.sendLoginLink(email)
				.then(() => ({email})),
			setOp: op => this.sentLoading = op,
			errorReason: `failed sending email to "${email}"`,
		})
	}

	private resetSentLoading() {
		this.sentLoading = ops.none()
		if (this.textInput)
			this.textInput.text = ""
	}

	private logout() {
		this.share.accessModel.logout()
			.then(() => this.sentLoading = ops.none())
	}

	subscribe() {
		return this.share.accessModel.subscribe(() => {
			this.resetSentLoading()
		})
	}

	private renderLoggedIn(access: AccessPayload) {
		return html`
			<slot>
				<p>Welcome ${access.user.profile.nickname}!</p>
			</slot>
			${this["show-logout"]
				? html`
					<div part=buttonbar>
						<xio-button class=logout-button @press=${this.logout}>
							Logout
						</xio-button>
					</div>
				`
				: null}
		`
	}

	private handleEmailChange() {
		this.emailIsValid = this.textInput.problems.length === 0
	}

	private renderLegalLink() {
		return html`
			<small>
				<p>
					<a
						part=link
						target=_blank
						href="https://xiome.io/legal">
							policies and terms
					</a>
				</p>
			</small>
		`
	}

	private renderLoggedOut() {
		const {emailIsValid} = this
		return html`
			<xio-op .op=${this.sentLoading}>
				<div slot=none>
					<slot name=logged-out>
						<p>login with your email address</p>
					</slot>
					<xio-text-input
						.validator=${email()}
						@valuechange=${this.handleEmailChange}
						@enterpress=${this.sendEmail}>
							<span>your email</span>
					</xio-text-input>
					<div class=buttonbar>
						<slot name=legal>
							${this.renderLegalLink()}
						</slot>
						<xio-button
							?disabled=${!emailIsValid}
							@press=${this.sendEmail}>
								send login link
						</xio-button>
					</div>
				</div>
				${ops.isReady(this.sentLoading)
					? html`
						<p>email sent to ${ops.value(this.sentLoading).email}</p>
						<p>please wait a few minutes for it to arrive</p>
						<xio-button @press=${this.resetSentLoading}>
							restart
						</xio-button>
					`
					: null}
			</xio-op>
		`
	}

	render() {
		const accessOp = this.share.accessModel.getAccessOp()
		this.status = "loading"
		if (ops.isReady(accessOp)) {
			this.status = ops.value(accessOp)?.user
				? "logged-in"
				: "logged-out"
		}
		return renderOp(accessOp, access => access?.user
			? this.renderLoggedIn(access)
			: this.renderLoggedOut()
		)
	}
}
