
import styles from "./xiome-subscription-planner.css.js"
import {BankModel} from "../../models/bank-manager/types/bank-model.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeSubscriptionPlanner extends WiredComponent<{
		modals: ModalSystem
		authModel: AuthModel
		bankModel: BankModel
	}> {

	render() {
		return null
	}
}
