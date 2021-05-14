
import {deepEqual} from "../../../toolbox/deep.js"
import {debounce2} from "../../../toolbox/debounce2.js"
import {select} from "../../../toolbox/select/select.js"

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

import {ProfileDraft} from "../../auth/topics/personal/types/profile-draft.js"
import {mixinStyles} from "../../../framework/component2/mixins/mixin-styles.js"
import {Component2, property, html} from "../../../framework/component2/component2.js"

function makeProfileDraftBasedOnProfile(profile: Profile): ProfileDraft {
	return {
		tagline: profile.tagline,
		nickname: profile.nickname,
	}
}

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

	init() {
		this.#actions.setBusy(ops.ready(undefined))
	}

	@property({type: Object})
	user?: User

	@property({type: Object})
	saveProfile?: (profile: ProfileDraft) => Promise<void>

	@property({type: Object})
	private profileDraft: ProfileDraft = undefined

	private get draftIsChanged(): boolean {
		return !!this.profileDraft
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

	private generateNewProfileDraftFromInputs() {
		const {profile} = this.user
		const profileDraft = makeProfileDraftBasedOnProfile(profile)
		const nicknameInput = this.getTextInputField("nickname")

		if (!nicknameInput)
			return {profileDraft, isChanged: false}

		const taglineInput = this.getTextInputField("tagline")

		profileDraft.nickname = nicknameInput.value
		profileDraft.tagline = taglineInput.value

		this.problems = [...nicknameInput.problems, ...taglineInput.problems]
		const isChanged = !deepEqual(
			makeProfileDraftBasedOnProfile(profile),
			profileDraft,
		)

		return {profileDraft, isChanged}
	}

	private handleChange = debounce2(200, () => {
		if (!this.user) return
		const {profileDraft, isChanged} = this.generateNewProfileDraftFromInputs()
		this.profileDraft = isChanged ? profileDraft : undefined
	})

	private handleSave = async() => {
		await ops.operation({
			promise: this.saveProfile(this.profileDraft)
				.finally(() => {
					this.profileDraft = null
				}),
			setOp: op => this.#actions.setBusy(op),
		})
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
				draftIsChanged: boolean
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
					?hide-validation=${!input.draftIsChanged}
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
		const {user, draftIsChanged} = this
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
							draftIsChanged,
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
							draftIsChanged,
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
						?disabled=${!this.profileDraft || this.problems.length > 0}
						@press=${this.handleSave}>
							<slot name=save-button>save profile</slot>
					</xio-button>
				</div>
			`}
		`)
	}
}
