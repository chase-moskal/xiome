
import styles from "./xiome-subscription-planner.css.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {PlanningSituation} from "../../models/subscription-planning-model/types/planning-situation.js"
import {subscriptionPlanningModel} from "../../models/subscription-planning-model/subscription-planning-model.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"

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
		const {subscriptionPlanningModel} = this.share
		return renderWrappedInLoading(
			subscriptionPlanningModel.getLoadingViews().loadingPlans,
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

	@property()
	private draft: SubscriptionPlanDraft = {
		label: <string>"",
		price: <number>0,
	}

	private renderCreator() {
		const {subscriptionPlanningModel} = this.share

		function handleChangeLabel({detail}: ValueChangeEvent<string>) {
			this.draft.label = detail
		}

		function handleChangePrice({detail}: ValueChangeEvent<number>) {
			this.draft.price = detail
		}

		function parsePrice(price: string) {
			return parseFloat(price) * 100
		}

		async function handleDraftSubmit() {
			await subscriptionPlanningModel.createPlan(this.draft)
		}

		return html`
			<p>subscription plan creator</p>
			${renderWrappedInLoading(
				subscriptionPlanningModel.getLoadingViews().loadingPlanCreation,
				() => html`
					<p>creator</p>

					<xio-text-input
						?show-validation-when-empty=${false}
						.validator=${() => []}
						@valuechange=${handleChangeLabel}>
							<span>plan label</span>
					</xio-text-input>

					<xio-text-input
						?show-validation-when-empty=${false}
						.validator=${() => []}
						.parser=${parsePrice}
						@valuechange=${handleChangePrice}>
							<span>plan price</span>
					</xio-text-input>

					<xio-button @press=${handleDraftSubmit}>
						create plan
					</xio-button>
				`
			)}
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
