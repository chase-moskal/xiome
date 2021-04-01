
import styles from "./xiome-subscription-planner.css.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {PlanningSituation} from "../../models/subscription-planning-model/types/planning-situation.js"
import {subscriptionPlanningModel} from "../../models/subscription-planning-model/subscription-planning-model.js"

@mixinStyles(styles)
export class XiomeSubscriptionPlanner extends WiredComponent<{
		modals: ModalSystem
		authModel: AuthModel
		subscriptionPlanningModel: ReturnType<typeof subscriptionPlanningModel>
	}> {

	firstUpdated() {
		this.share.subscriptionPlanningModel.indicateComponentInitialization()
	}

	private renderListOfSubscriptionPlans() {
		return renderWrappedInLoading(

			this.share.subscriptionPlanningModel
				.getLoadingViewForSubscriptionPlans(),

			subscriptionPlans => html`
				<p>subscription plans:</p>
				<ol>
					${subscriptionPlans.map(plan => html`
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
		const mode = this.share.subscriptionPlanningModel.getSituationMode()
		switch (mode) {

			case PlanningSituation.Mode.StoreUninitialized:
				return html`<p>store is not initialized</p>`

			case PlanningSituation.Mode.LoggedOut:
				return html`<p>you must be logged in to plan subscriptions</p>`

			case PlanningSituation.Mode.Unprivileged:
				return html`<p>you're lacking privileges to plan subscriptions</p>`

			case PlanningSituation.Mode.Privileged:
				return renderWrappedInLoading(
					this.share.authModel.accessLoadingView,
					() => html`
						${this.renderListOfSubscriptionPlans()}
						${this.renderCreator()}
					`
				)

			default:
				throw new Error("unknown planning situation mode")
		}
	}
}
