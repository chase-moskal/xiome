
import {nap} from "./toolbox/nap.js"
import {ops} from "./framework/ops.js"
import {User} from "./features/auth/types/user.js"
import {ProfileDraft} from "./features/auth/topics/personal/types/profile-draft.js"
import {Component2, mixinLightDom, registerComponents, html, property} from "./framework/component2/component2.js"

@mixinLightDom
class XioPlayground extends Component2 {

	@property({type: Object})
	private user: User = {
		userId: "8NSpzxSPHkgWfD79y2D96zZzhSrT2gbxDsxnpNGkGYpxwSSn",
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

			<p class=lowkey>xiome-questions</p>
			<xiome-questions></xiome-questions>

			<p class=lowkey>xio-profile-card: readonly</p>
			<xio-profile-card show-details .user=${user}></xio-profile-card>

			<p class=lowkey>xio-profile-card: editable</p>
			<xio-profile-card
				show-details
				.user=${user}
				.saveProfile=${this.saveProfile}
			></xio-profile-card>

			<p class=lowkey>xio-op</p>
			<xio-op .op=${ops.loading()}></xio-op>
		`
	}
}

registerComponents({XioPlayground})
