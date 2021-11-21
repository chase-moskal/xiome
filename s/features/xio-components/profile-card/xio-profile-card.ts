
import styles from "./xio-profile-card.css.js"
import {Op, ops} from "../../../framework/ops.js"
import {deepEqual} from "../../../toolbox/deep.js"
import {renderText} from "./renders/render-text.js"
import {renderRoles} from "./renders/render-roles.js"
import {select} from "../../../toolbox/select/select.js"
import {XioTextInput} from "../inputs/xio-text-input.js"
import {renderDetails} from "./renders/render-details.js"
import {User} from "../../auth/aspects/users/types/user.js"
import {debounce} from "../../../toolbox/debounce/debounce.js"
import {makeProfileDraft} from "./helpers/make-profile-draft.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {mixinStyles} from "../../../framework/component/mixins/mixin-styles.js"
import {AutowatcherComponent, property, html} from "../../../framework/component.js"
import {ProfileDraft} from "../../auth/aspects/users/routines/personal/types/profile-draft.js"
import {profileValidators} from "../../auth/aspects/users/routines/personal/validate-profile-draft.js"

@mixinStyles(styles)
export class XioProfileCard extends AutowatcherComponent {

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

	private handleChange = debounce(200, () => {
		if (!this.user) return
		const {profileDraft, isChanged} = this.generateNewProfileDraftFromInputs()
		this.profileDraft = isChanged ? profileDraft : undefined
	})

	private handleSave = async() => {
		const {profileDraft} = this
		await ops.operation({
			promise: this.saveProfile(profileDraft)
				.finally(() => {
					this.profileDraft = null
				}),
			setOp: op => this.#actions.setBusy(op),
		})
		const setToTextField = (field: string, text: string) => {
			const input = this.shadowRoot.querySelector<XioTextInput>(
				`xio-text-input[data-field="${field}"]`
			)
			input.text = text
		}
		setToTextField("nickname", profileDraft.nickname)
		setToTextField("tagline", profileDraft.tagline)
	}

	render() {
		const {user, draftIsChanged} = this
		if (!user)
			return null
		const avatarSpec = user.profile.avatar
		return renderOp(this.#state.busy, () => html`
			<div class=container ?data-readonly=${this.readonly}>
				<xio-avatar part=avatar .spec=${avatarSpec}></xio-avatar>
				<div class=box>
					<div part=nameplate>
						${renderText({
							field: "nickname",
							initial: this.profileDraft
								? this.profileDraft.nickname
								: user.profile.nickname,
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
							initial: this.profileDraft
								? this.profileDraft.tagline
								: user.profile.tagline,
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
