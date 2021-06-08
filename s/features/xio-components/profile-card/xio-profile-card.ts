
import {User} from "../../auth/types/user.js"
import styles from "./xio-profile-card.css.js"
import {Op, ops} from "../../../framework/ops.js"
import {deepEqual} from "../../../toolbox/deep.js"
import {renderText} from "./renders/render-text.js"
import {renderRoles} from "./renders/render-roles.js"
import {debounce2} from "../../../toolbox/debounce2.js"
import {select} from "../../../toolbox/select/select.js"
import {XioTextInput} from "../inputs/xio-text-input.js"
import {renderDetails} from "./renders/render-details.js"
import {makeProfileDraft} from "./helpers/make-profile-draft.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {ProfileDraft} from "../../auth/topics/personal/types/profile-draft.js"
import {mixinStyles} from "../../../framework/component2/mixins/mixin-styles.js"
import {profileValidators} from "../../auth/topics/personal/validate-profile-draft.js"
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

	init() {
		this.#actions.setBusy(ops.ready(undefined))
	}

	@property({type: Boolean})
	["show-details"]: boolean

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
		const profileDraft = makeProfileDraft(profile)
		const nicknameInput = this.getTextInputField("nickname")

		if (!nicknameInput)
			return {profileDraft, isChanged: false}

		const taglineInput = this.getTextInputField("tagline")

		profileDraft.nickname = nicknameInput.value
		profileDraft.tagline = taglineInput.value

		this.problems = [...nicknameInput.problems, ...taglineInput.problems]
		const isChanged = !deepEqual(
			makeProfileDraft(profile),
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

	render() {
		const {user, draftIsChanged} = this
		if (!user)
			return null
		const avatarSpec = user.profile.avatar
		return renderOp(this.#state.busy, () => html`
			<div class=container ?data-readonly=${this.readonly}>
				<xio-avatar .spec=${avatarSpec}></xio-avatar>
				<div class=box>
					<div class=textfields>
						${renderText({
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
						${renderText({
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
						${renderRoles(user)}
						${this.readonly ? null : html`
							<div class=buttonbar>
								<xio-button
									?disabled=${!this.profileDraft || this.problems.length > 0}
									@press=${this.handleSave}>
										<slot name=save-button>save profile</slot>
								</xio-button>
							</div>
						`}
					</div>
					${this["show-details"]
						? renderDetails(user)
						: null}
				</div>
			</div>
		`)
	}
}
