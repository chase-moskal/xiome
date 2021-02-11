
import {User} from "./features/auth/auth-types.js"
import {Component, mixinLightDom, registerComponents, html} from "./framework/component.js"

@mixinLightDom
class XioPlayground extends Component {

	render() {

		const user: User = {
			userId: "abc123",
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

		return html`
			<p>xio-profile-card</p>
			<xio-profile-card
				.user=${user}
			></xio-profile-card>
		`
	}
}

registerComponents({XioPlayground})
