
import styles from "./xiome-my-account.css.js"
import {AuthModel} from "../../models/types/auth/auth-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ProfileDraft} from "../../topics/personal/types/profile-draft.js"
import {PersonalModel} from "../../models/types/personal/personal-model.js"
import {Component2WithShare, html, mixinStyles} from "../../../../framework/component2/component2.js"

@mixinStyles(styles)
export class XiomeMyAccount extends Component2WithShare<{
		authModel: AuthModel
		personalModel: PersonalModel
	}> {

	private saveProfile = async(profileDraft: ProfileDraft) => {
		this.share.personalModel.saveProfile(profileDraft)
	}

	render() {
		return renderOp(this.share.authModel.access, ({user}) => html`
			<xio-profile-card
				show-details
				.user=${user}
				.saveProfile=${this.saveProfile}
			></xio-profile-card>
		`)
	}
}
