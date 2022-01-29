
import styles from "./xiome-my-account.css.js"
import {makePersonalModel} from "../../models/personal-model.js"
import {ProfileDraft} from "../../routines/personal/types/profile-draft.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeMyAccount extends mixinRequireShare<{
		personalModel: ReturnType<typeof makePersonalModel>
	}>()(Component) {

	private saveProfile = async(profileDraft: ProfileDraft) => {
		await this.share.personalModel.saveProfile(profileDraft)
	}

	render() {
		const {accessOp} = this.share.personalModel.readable
		return renderOp(accessOp, ({user}) => html`
			<xio-profile-card
				show-details
				.user=${user}
				.saveProfile=${this.saveProfile}
			></xio-profile-card>
		`)
	}
}
