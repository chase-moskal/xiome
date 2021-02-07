
import {debounce2} from "../../../toolbox/debounce2.js"
import {select} from "../../../toolbox/select/select.js"
import {deepClone, deepEqual} from "../../../toolbox/deep.js"
import {loading} from "../../../framework/loading/loading.js"
import {mixinStyles} from "../../../framework/component/mixin-styles.js"
import {Component, html, property, css} from "../../../framework/component.js"
import {renderWrappedInLoading} from "../../../framework/loading/render-wrapped-in-loading.js"

import {profileValidator} from "./validators/profile-validator.js"

import {User, Profile} from "../../auth/auth-types.js"

const styles = css`

.cardplate > * {
	display: block;
}

.cardplate > * + * {
	margin-top: 0.4rem;
}

.tags {
	list-style: none;
	font-size: 0.6em;
	cursor: default;
}

.tags > li {
	display: inline-block;
	margin: 0 0.1em;
	padding: 0 0.25em;
	border: 1px solid;
	border-radius: 1em;
}

[data-tag=staff] {
	color: var(--cobalt-tagcolor-staff, lime);
}

[data-tag=banned] {
	color: var(--cobalt-tagcolor-banned, red);
}

.textfield {
	display: block;
	width: 100%;
}

iron-text-input {
	display: block;
}

.tagline {
	font-style: italic;
}

.tagline[readonly] {
	opacity: 0.8;
	font-size: 0.8em;
}

.tagline.value-present::before,
.tagline.value-present::after {
	content: '"';
}

.detail {
	opacity: 0.5;
	font-size: 0.7em;
	list-style: none;
}

.buttonbar {
	margin-top: 1rem;
	text-align: right;
}

`

 @mixinStyles(styles)
export class XioProfileCard extends Component {

	@property({type: Object})
	user?: User

	@property({type: Object})
	saveProfile?: (profile: Profile) => Promise<void>

	// @property({type: Boolean})
	// private busy: boolean = false

	@property()
	private busy2 = loading<void>()

	@property({type: Object})
	private changedProfile: Profile = undefined

	private get readonly() {
		return !this.saveProfile
	}

	private generateNewProfileFromInputs(): Profile {
		const {profile} = this.user
		const clonedProfile = deepClone(profile)
		const getValue = (name: string) => select<HTMLInputElement>(
			`xio-text-input.${name}`,
			this.shadowRoot,
		).value
		clonedProfile.nickname = getValue("nickname")
		clonedProfile.tagline = getValue("tagline")
		return clonedProfile
	}

	private handleChange = debounce2(200, () => {
		if (!this.user) return
		const {profile} = this.user
		const newProfile = this.generateNewProfileFromInputs()
		const changes = !deepEqual(profile, newProfile)
		this.changedProfile = changes ? newProfile : undefined
	})

	private renderTags(user: User) {
		// const {readonly} = this

		const isStaff = user.tags.find(tag => tag === "staff")
		const isBanned = user.tags.find(tag => tag === "banned")
		const isPremium = user.tags.find(tag => tag === "premium")

		const renderTag = (tag: string, title?: string) =>
			html`<li data-tag=${tag} title=${title || ""}>${tag}</li>`

		let items = []
		if (isBanned)
			items.push(renderTag(
				"banned",
				// `banned until ${formatDate(user.claims.banUntil).datestring}, reason: ${user.claims.banReason}`
			))
		if (isStaff)
			items.push(renderTag("staff"))
		if (isPremium)
			items.push(renderTag(
				"premium",
				// readonly
				// 	? undefined
				// 	: `premium until ${formatDate(user.claims.premiumUntil).datestring}`
			))

		return items.length
			? html`<ol class="tags">${items}</ol>`
			: null
	}

	private handleSave = async() => {
		const profile = this.changedProfile
		this.changedProfile = null
		this.busy2.actions.setLoadingUntil({
			errorReason: "failed to save profile",
			promise: this.saveProfile(profile)
		})
	}

	render() {
		const {user, busy2, readonly, handleChange, handleSave} = this
		if (!user) return null
		const {userId, profile} = user
		return renderWrappedInLoading(busy2.view, () => html`
			<div class=textfields>
				<xio-text-input
					class=nickname
					initial=${profile.nickname}
					?readonly=${readonly}
					.validator=${profileValidator.nickname}
					@textchange=${handleChange}
				></xio-text-input>
				<xio-text-input
					class=tagline
					initial=${profile.tagline}
					?readonly=${readonly}
					.validator=${profileValidator.tagline}
					@textchange=${handleChange}
				></xio-text-input>
			</div>
			${this.renderTags(user)}
			<ul class="detail">
				<li>user id: <span>${userId}</span></li>
			</ul>
			${this.changedProfile ? html`
				<div class="buttonbar">
					<button @click=${handleSave}>
						Save
					</button>
				</div>
			` : null}
		`)
	}
}
