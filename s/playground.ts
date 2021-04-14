
import {nap} from "./toolbox/nap.js"
import {User} from "./features/auth/types/user.js"
import {Component, mixinLightDom, registerComponents, html} from "./framework/component.js"

@mixinLightDom
class XioPlayground extends Component {

	render() {

		const user: User = {
			userId: "8NSpzxSPHkgWfD79y2D96zZzhSrT2gbxDsxnpNGkGYpxwSSn",
			profile: {
				avatar: "",
				nickname: "Original Ostrich",
				tagline: "i'm super cool",
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
		`
	}
}

registerComponents({XioPlayground})
