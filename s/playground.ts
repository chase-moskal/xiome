
import {nap} from "./toolbox/nap.js"
import {ops} from "./framework/ops.js"
import {User} from "./features/auth/types/user.js"
import {Component2, mixinLightDom, registerComponents, html} from "./framework/component2/component2.js"

@mixinLightDom
class XioPlayground extends Component2 {

	render() {
		const user: User = {
			userId: "8NSpzxSPHkgWfD79y2D96zZzhSrT2gbxDsxnpNGkGYpxwSSn",
			profile: {
				nickname: "Original Ostrich",
				tagline: "i'm super cool",
				avatar: "https://www.gravatar.com/avatar/a6263131d6ccdbfe1c7cee96da970eda?s=240",
			},
			roles: [],
			stats: {
				joined: Date.now() - (1000 * 60 * 60 * 24 * 365),
			},
		}

		const saveProfile = async(profile: User["profile"]) => {
			await nap(1000)
			user.profile = profile
			console.log("save profile:", profile)
		}

		return html`
			<p>xio-profile-card: readonly</p>
			<xio-profile-card .user=${user}></xio-profile-card>

			<p>xio-profile-card: editable</p>
			<xio-profile-card
				.user=${user}
				.saveProfile=${saveProfile}
			></xio-profile-card>

			<p>xio-op</p>
			<xio-op .op=${ops.loading()}></xio-op>
		`
	}
}

registerComponents({XioPlayground})
