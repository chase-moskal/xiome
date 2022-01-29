
import {nap} from "../../toolbox/nap.js"
import {ops} from "../../framework/ops.js"
import {User} from "../auth/aspects/users/types/user.js"
import {ProfileDraft} from "../auth/aspects/users/routines/personal/types/profile-draft.js"
import {Component, mixinLightDom, registerComponents, html, property} from "../../framework/component.js"

class XioPlayground extends mixinLightDom(Component) {

	@property({type: Object})
	private user: User = {
		userId: "bcd22b97940174ce94aee93347a652c775f8b5d021b291525eadc8d3dc3dd7d4",
		profile: {
			nickname: "Original Ostrich",
			tagline: "i'm super cool",
			avatar: undefined,
		},
		roles: [{
			label: "premium",
			roleId: "lol12i309u12893h1",
			timeframeEnd: undefined,
			timeframeStart: undefined,
		}],
		stats: {
			joined: Date.now() - (1000 * 60 * 60 * 24 * 365),
		},
	}

	private saveProfile = async(profileDraft: ProfileDraft) => {
		await nap(1000)
		this.user = {
			...this.user,
			profile: {...this.user.profile, ...profileDraft},
		}
		this.requestUpdate()
	}

	render() {
		const {user} = this
		return html`

			<h3>xio-profile-card: readonly</h3>
			<xio-profile-card show-details .user=${user}></xio-profile-card>

			<h3>xio-profile-card: editable</h3>
			<xio-profile-card
				show-details
				.user=${user}
				.saveProfile=${this.saveProfile}
			></xio-profile-card>

			<h3>xio-op</h3>
			<xio-op .op=${ops.loading()}></xio-op>
		`
	}
}

registerComponents({XioPlayground})
