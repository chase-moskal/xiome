
import styles from "./xiome-my-account.css.js"
import {makeAccessModel} from "../../models/access-model.js"
import {makePersonalModel} from "../../models/personal-model.js"
import {ProfileDraft} from "../../routines/personal/types/profile-draft.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {AutowatcherComponentWithShare, html, mixinStyles} from "../../../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomeMyAccount extends AutowatcherComponentWithShare<{
		accessModel: ReturnType<typeof makeAccessModel>
		personalModel: ReturnType<typeof makePersonalModel>
	}> {

	private saveProfile = async(profileDraft: ProfileDraft) => {
		await this.share.personalModel.saveProfile(profileDraft)
	}

	render() {
		return renderOp(this.share.accessModel.access, ({user}) => html`
			<xio-profile-card
				show-details
				.user=${user}
				.saveProfile=${this.saveProfile}
			></xio-profile-card>
		`)
	}
}
