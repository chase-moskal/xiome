
import {debounce2} from "../../../toolbox/debounce2.js"
import {select} from "../../../toolbox/select/select.js"
import {loading} from "../../../framework/loading/loading.js"
import {deepClone, deepEqual} from "../../../toolbox/deep.js"
import {mixinStyles} from "../../../framework/component/mixin-styles.js"
import {Component, html, property} from "../../../framework/component.js"
import {renderWrappedInLoading} from "../../../framework/loading/render-wrapped-in-loading.js"

import styles from "./xio-profile-card.css.js"
import {Validator} from "../../../toolbox/darkvalley.js"
import {profileValidator} from "./validators/profile-validator.js"
import {ValueChangeEvent} from "../inputs/events/value-change-event.js"

import {User, Profile} from "../../auth/auth-types.js"
import {XioTextInput} from "../inputs/xio-text-input.js"
import {formatDate} from "../../../toolbox/goodtimes/format-date.js"

@mixinStyles(styles)
export class XioProfileCard extends Component {

	@property({type: Object})
	user?: User

	@property({type: Object})
	saveProfile?: (profile: Profile) => Promise<void>

	@property()
	private busy2 = loading<void>()

	@property({type: Object})
	private changedProfile: Profile = undefined

	private get changes(): boolean {
		return !!this.changedProfile
	}

	private get readonly() {
		return !this.saveProfile
	}

	private problems: string[] = []

	private getTextInputField(name: string) {
		return select<XioTextInput>(
			`xio-text-input[data-field="${name}"]`,
			this.shadowRoot,
		)
	}

	private generateNewProfileFromInputs(): Profile {
		const {profile} = this.user
		const clonedProfile = deepClone(profile)
		const nicknameInput = this.getTextInputField("nickname")
		if (!nicknameInput) return clonedProfile
		const taglineInput = this.getTextInputField("tagline")
		clonedProfile.nickname = nicknameInput.value
		clonedProfile.tagline = taglineInput.value
		this.problems = [...nicknameInput.problems, ...taglineInput.problems]
		return clonedProfile
	}

	private handleChange = debounce2(200, () => {
		if (!this.user) return
		const {profile} = this.user
		const newProfile = this.generateNewProfileFromInputs()
		const changes = !deepEqual(profile, newProfile)
		this.changedProfile = changes ? newProfile : undefined
	})

	private renderRoles(user: User) {
		return user.roles.map(role => html`
			<li>${role.label}</li>
		`)
	}

	private renderDetails(user: User) {
		return html`
			<li>user id: <span>${user.userId}</span></li>
			<li>joined: <span>${formatDate(user.stats.joined).date}</span></li>
		`
	}

	// private renderTags(user: User) {
	// 	const {readonly} = this

	// 	const staffRole = user.roles.find(role => role.label === "staff")
	// 	const bannedRole = user.roles.find(role => role.label === "banned")
	// 	const premiumRole = user.roles.find(role => role.label === "premium")

	// 	const renderTag = (tag: string, title?: string) =>
	// 		html`<li data-tag=${tag} title=${title || ""}>${tag}</li>`

	// 	let items = []
	// 	if (bannedRole)
	// 		items.push(renderTag(
	// 			"banned",
	// 			`banned until ${formatDate(bannedRole.timeframeEnd).date}`
	// 		))
	// 	if (staffRole)
	// 		items.push(renderTag("staff"))
	// 	if (premiumRole)
	// 		items.push(renderTag(
	// 			"premium",
	// 			readonly
	// 				? undefined
	// 				: `premium until ${formatDate(premiumRole.timeframeEnd).date}`
	// 		))

	// 	return items.length
	// 		? html`<ol class="tags">${items}</ol>`
	// 		: null
	// }

	private handleSave = async() => {
		const profile = this.changedProfile
		this.busy2.actions.setLoadingUntil({
			errorReason: "failed to save profile",
			promise: this.saveProfile(profile)
				.finally(() => {
					this.changedProfile = null
				})
		})
	}

	firstUpdated() {
		this.busy2.actions.setReady()
	}

	render() {
		const {user} = this
		if (!user) return null
		const {userId, profile} = user

		const renderText = (({field, text, input}: {
				field: string
				text: string
				input?: {
					label: string
					changes: boolean
					readonly: boolean
					validator: Validator<string>
					onvaluechange: (event: ValueChangeEvent<string>) => void
				}
			}) => input
			? html`
				<xio-text-input
					data-field="${field}"
					initial=${text}
					part="xiotextinput"
					exportparts="${`
						label: xiotextinput-label,
						textinput: xiotextinput-textinput,
						problems: xiotextinput-problems,
					`}"
					show-validation-when-empty
					?readonly=${input.readonly}
					?hide-validation=${!input.changes}
					.validator=${input.validator}
					@valuechange=${input.onvaluechange}>
						<span>${input.label}</span>
				</xio-text-input>
			`
			: html`
				<p part="textfield" data-field="${field}">${text}</p>
			`
		)

		return renderWrappedInLoading(this.busy2.view, () => html`
			<div class=textfields ?data-readonly=${this.readonly}>
				${renderText({
					field: "nickname",
					text: profile.nickname,
					input: this.readonly
						? undefined
						: {
							label: "nickname",
							readonly: false,
							changes: this.changes,
							validator: profileValidator.nickname,
							onvaluechange: this.handleChange,
						}
				})}
				${renderText({
					field: "tagline",
					text: profile.tagline,
					input: this.readonly
						? undefined
						: {
							label: "tagline",
							readonly: false,
							changes: this.changes,
							validator: profileValidator.tagline,
							onvaluechange: this.handleChange,
						}
				})}
			</div>
			<ul class=roles>
				${this.renderRoles(user)}
			</ul>
			<ul class="detail">
				${this.renderDetails(user)}
			</ul>
			${this.readonly ? null : html`
				<div class="buttonbar">
					<xio-button
						?disabled=${!this.changedProfile || this.problems.length > 0}
						@press=${this.handleSave}>
							<slot name=save-button>save profile</slot>
					</xio-button>
				</div>
			`}
		`)
	}
}
