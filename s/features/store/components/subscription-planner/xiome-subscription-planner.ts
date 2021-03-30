
import styles from "./xiome-subscription-planner.css.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {subscriptionPlanningModel} from "../../models/subscription-planning-model/subscription-planning-model.js"

@mixinStyles(styles)
export class XiomeSubscriptionPlanner extends WiredComponent<{
		modals: ModalSystem
		subscriptionPlanningModel: ReturnType<typeof subscriptionPlanningModel>
	}> {

	firstUpdated() {
		this.share.subscriptionPlanningModel.load()
	}

	private renderList() {
		return renderWrappedInLoading(
			this.share.subscriptionPlanningModel.subscriptionPlanLoadingView,
			plans => html`
				<ol>
					${plans.map(plan => html`
						<li>
							<p>${plan.label}</p>
							<p>price: ${plan.price}</p>
							<p>active: ${plan.active ? "active" : "deactivated"}</p>
							<p>subscription plan id: ${plan.subscriptionPlanId}</p>
							<p>role id: ${plan.roleId}</p>
						</li>
					`)}
				</ol>
			`,
		)
	}

	private renderCreator() {
		return html`
			<p>subscription plan creator</p>
		`
	}

	render() {
		return html`
			${this.renderList()}
			${this.renderCreator()}
		`
	}
}
