
import styles from "./xiome-login-panel.css.js"
import {AccessPayload} from "../../../../types.js"
import {loading} from "../../../../toolbox/loading/loading.js"
import {makeAuthModel} from "../../models/auth-model2.js"
import {ZapTextInput} from "../../../zapcomponents/inputs/zap-text-input.js"
import {emailValidator} from "../../../zapcomponents/inputs/validators/email-validator.js"
import {WiredComponent, html, mixinStyles, property, query} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeLoginPanel extends WiredComponent<{authModel: AuthModel}> {

	@property({type: Object})
	private sendLoading = loading<{email: string}>()

	@query("zap-text-input")
	private zapTextInput: ZapTextInput

	@property({type: String})
	private emailIsValid = false

	private handleEmailChange() {
		this.emailIsValid = this.zapTextInput.problems.length === 0
	}

	private async sendLoginLink() {
		const email = this.zapTextInput.text
		this.sendLoading.actions.setLoadingUntil({
			promise: this.share.authModel.sendLoginLink(email)
				.then(() => ({email})),
			errorReason: `failed sending email to "${email}"`,
		})
	}

	private resetSendLoading() {
		this.sendLoading.actions.setNone()
		if (this.zapTextInput) this.zapTextInput.text = ""
	}

	private logout() {
		this.share.authModel.logout()
	}

	subscribe() {
		return this.share.authModel.onAccessChange(() => {
			this.resetSendLoading()
		})
	}

	private renderLoggedIn(access: AccessPayload) {
		return html`
			<slot>
				<p>Welcome ${access.user.profile.nickname}!</p>
			</slot>
			<button @click=${this.logout}>Logout</button>
		`
	}

	private renderLoggedOut() {
		const {emailIsValid} = this
		return html`
			<zap-loading .loadingView=${this.sendLoading.view}>
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
						@click=${this.sendLoginLink}>
							Send login link
					</button>
				</div>
				${this.sendLoading.view.ready ? html`
					<p>email sent to ${this.sendLoading.view.payload.email}</p>
					<button @click=${this.resetSendLoading}>try another address?</button>
				` : null}
			</zap-loading>
		`
	}

	render() {
		const {accessLoadingView} = this.share.authModel
		const access = accessLoadingView.payload
		return html`
			<zap-loading .loadingView=${accessLoadingView}>
				${access
					? this.renderLoggedIn(access)
					: this.renderLoggedOut()}
			</zap-loading>
		`
	}
}

type AuthModel = ReturnType<typeof makeAuthModel>
