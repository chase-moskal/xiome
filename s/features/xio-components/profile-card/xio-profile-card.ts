
import {debounce2} from "../../../toolbox/debounce2.js"
import {select} from "../../../toolbox/select/select.js"
import {deepClone, deepEqual} from "../../../toolbox/deep.js"

import styles from "./xio-profile-card.css.js"
import {Validator} from "../../../toolbox/darkvalley.js"
import {ValueChangeEvent} from "../inputs/events/value-change-event.js"
import {profileValidators} from "../../auth/topics/personal/validate-profile-draft.js"

import {User} from "../../auth/types/user.js"
import {Op, ops} from "../../../framework/ops.js"
import {Profile} from "../../auth/types/profile.js"
import {XioTextInput} from "../inputs/xio-text-input.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {formatDate} from "../../../toolbox/goodtimes/format-date.js"

import {mixinStyles} from "../../../framework/component2/mixins/mixin-styles.js"
import {Component2, property, html} from "../../../framework/component2/component2.js"

@mixinStyles(styles)
export class XioProfileCard extends Component2 {

	#state = this.auto.state({
		busy: <Op<void>>ops.ready(undefined),
	})

	#actions = this.auto.actions({
		setBusy: (op: Op<void>) => {
			this.#state.busy = op
		},
	})

	@property({type: Object})
	user?: User

	@property({type: Object})
	saveProfile?: (profile: Profile) => Promise<void>

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
		await ops.operation({
			promise: this.saveProfile(profile)
				.finally(() => {
					this.changedProfile = null
				}),
			setOp: op => this.#actions.setBusy(op),
		})
	}

	init() {
		this.#actions.setBusy(ops.ready(undefined))
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

	private renderText({field, text, input}: {
			field: string
			text: string
			input?: {
				label: string
				changes: boolean
				readonly: boolean
				validator: Validator<string>
				onvaluechange: (event: ValueChangeEvent<string>) => void
			}
		}) {
		return input
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
	}

	render() {
		const {user} = this
		if (!user) return null
		return renderOp(this.#state.busy, () => html`
			<xio-avatar .user=${user}></xio-avatar>
			<div class=textfields ?data-readonly=${this.readonly}>
				${this.renderText({
					field: "nickname",
					text: user.profile.nickname,
					input: this.readonly
						? undefined
						: {
							label: "nickname",
							readonly: false,
							changes: this.changes,
							validator: profileValidators.nickname,
							onvaluechange: this.handleChange,
						}
				})}
				${this.renderText({
					field: "tagline",
					text: user.profile.tagline,
					input: this.readonly
						? undefined
						: {
							label: "tagline",
							readonly: false,
							changes: this.changes,
							validator: profileValidators.tagline,
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
