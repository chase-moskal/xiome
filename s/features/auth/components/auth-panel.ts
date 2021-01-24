
import styles from "./styles/auth-panel.css.js"
import {WiredComponent, html, mixinStyles, WithShare} from "../../../framework/component.js"
import { makeAuthModel } from "../models/auth-model.js"

type AuthModel = ReturnType<typeof makeAuthModel>

@mixinStyles(styles)
export class AuthPanel extends WiredComponent<AuthModel> {

	private sendLoginLink() {
		const email = "chasemoskal@gmail.com"
		this.share.sendLoginLink(email)
	}

	render() {
		const {access} = this.share
		return html`
			<p>auth panel</p>
			${!!access
				? html`
					<p>logged in as ${access.user.profile.nickname}</p>
				`
				: html`
					<p>logged out</p>
					<button @click=${this.sendLoginLink}>Send login link</button>
				`}
		`
	}
}
