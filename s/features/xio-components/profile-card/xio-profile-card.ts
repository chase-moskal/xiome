
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

import {Profile} from "../../auth/types/profile.js"
import {User} from "../../auth/types/user.js"
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

	private renderRoles(user: User) {
		return user.roles.map(role => html`
			<li data-role-label="${role.label}">${role.label}</li>
		`)
	}

	private renderDetails(user: User) {
		return html`
			<li>
				<span>joined:</span>
				<span>${formatDate(user.stats.joined).date}</span>
			</li>
			<li>
				<xio-id
					label="user id"
					id="${user.userId}"
				></xio-id>
			</li>
		`
	}

	render() {
		const {user} = this
		if (!user) return null

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
					text: user.profile.nickname,
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
					text: user.profile.tagline,
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
