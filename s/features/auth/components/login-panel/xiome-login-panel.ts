
import styles from "./xiome-login-panel.css.js"
import {AccessPayload} from "../../../../types.js"
import {AuthModel} from "../../types/auth-model.js"
import {loading} from "../../../../toolbox/loading/loading.js"
import {ZapTextInput} from "../../../zapcomponents/inputs/zap-text-input.js"
import {whenLoadingIsDone} from "../../../../framework/loading/when-loading-is-done.js"
import {emailValidator} from "../../../zapcomponents/inputs/validators/email-validator.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {WiredComponent, html, mixinStyles, property, query, maybe} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeLoginPanel extends WiredComponent<{authModel: AuthModel}> {

	@property({type: Boolean, reflect: true})
	["show-logout"]: boolean = false

	private sentLoading = loading<{email: string}>()

	@query("zap-text-input")
	private zapTextInput: ZapTextInput

	@property({type: String})
	private emailIsValid = false

	private async sendEmail() {
		const email = this.zapTextInput.text
		this.sentLoading.actions.setLoadingUntil({
			promise: this.share.authModel.sendLoginLink(email)
				.then(() => ({email})),
			errorReason: `failed sending email to "${email}"`,
		})
	}

	private resetSentLoading() {
		this.sentLoading.actions.setNone()
		if (this.zapTextInput) this.zapTextInput.text = ""
	}

	private logout() {
		this.share.authModel.logout()
	}

	subscribe() {
		return this.share.authModel.onAccessChange(() => {
			this.resetSentLoading()
		})
	}

	private renderLoggedIn(access: AccessPayload) {
		return html`
			<slot>
				<p>Welcome ${access.user.profile.nickname}!</p>
			</slot>
			${this["show-logout"]
				? html`<button @click=${this.logout}>Logout</button>`
				: null}
		`
	}

	private handleEmailChange() {
		this.emailIsValid = this.zapTextInput.problems.length === 0
	}

	private renderLoggedOut() {
		const {emailIsValid} = this
		const sentLoadingView = this.sentLoading.view
		return html`
			<zap-loading .loadingView=${sentLoadingView}>
				<div slot=none>
					<slot name=logged-out>
						<p>Login with your email address</p>
					</slot>
					<zap-text-input
						placeholder="enter your email"
						.validator=${emailValidator}
						@textchange=${this.handleEmailChange}
					></zap-text-input>
					<button
						?disabled=${!emailIsValid}
						@click=${this.sendEmail}>
							Send login link
					</button>
				</div>
				${whenLoadingIsDone(sentLoadingView, sent => html`
					<p>email sent to ${sent.email}</p>
					<button @click=${this.resetSentLoading}>try another address?</button>
				`)}
			</zap-loading>
		`
	}

	render() {
		const {accessLoadingView} = this.share.authModel
		return renderWrappedInLoading(accessLoadingView, access => access
			? this.renderLoggedIn(access)
			: this.renderLoggedOut()
		)
	}
}
