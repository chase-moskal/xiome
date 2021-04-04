
import styles from "./xiome-subscription-planner.css.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"
import {SubscriptionPlan} from "../../topics/types/subscription-plan.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {PlanningSituation} from "../../models/subscription-planning-model/types/planning-situation.js"
import {subscriptionPlanningModel} from "../../models/subscription-planning-model/subscription-planning-model.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {renderIdentifier} from "./views/render-identifier.js"

@mixinStyles(styles)
export class XiomeSubscriptionPlanner extends WiredComponent<{
		modals: ModalSystem
		authModel: AuthModel
		subscriptionPlanningModel: ReturnType<typeof subscriptionPlanningModel>
	}> {

	@property()
	private draft: SubscriptionPlanDraft = {
		label: <string>"",
		price: <number>0,
	}

	firstUpdated() {
		this.share.subscriptionPlanningModel.requestToStartLoadingPlans()
	}

	private renderListOfSubscriptionPlans(plans: SubscriptionPlan[]) {
		return html`
			<ol class=plans>
				${plans.map(plan => html`
					<li ?data-active=${plan.active}>
						<div class=planinfo>
							<p class=label>${plan.label}</p>
							<div class=price>price: ${plan.price}</div>
							<div class=activity>
								<span class=activity-indicator>${plan.active ? "active" : "deactivated"}</span>
								<span class=activity-explainer>
									${plan.active
										? `this plan is available for sale`
										: `this plan is not for sale. recurring billing has ended. customers might still own this plan`}
								</span>
							</div>
							<div class=details>
								${renderIdentifier({
									label: "plan id",
									id: plan.subscriptionPlanId,
								})}
								${renderIdentifier({
									label: "role id",
									id: plan.roleId,
								})}
							</div>
						</div>
						<div class=plancontrols>
							${plan.active
								? html`
									<p>plan deactivation cancels existing subscriptions, and prevents new ones, but customers keep the permissions. this cannot be undone</p>
									<xio-button>deactivate</xio-button>
								`
								: html`
									<p>deletion permanently removes the permissions role that users may have purchased</p>
									<p>to be fair to your customers, you should wait until all existing subscriptions have expired for a plan, before considering deletion. this cannot be undone</p>
									<xio-button>delete</xio-button>
								`}
						</div>
					</li>
				`)}
			</ol>
		`
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
			<div>
				<h3>create a new subscription plan</h3>

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
			</div>
		`
	}

	render() {
		const {subscriptionPlanningModel, authModel} = this.share
		const mode = subscriptionPlanningModel.getSituationMode()
		switch (mode) {

			case PlanningSituation.Mode.StoreUninitialized:
				return html`
					<p class=warning>
						store is not initialized
					</p>
				`

			case PlanningSituation.Mode.LoggedOut:
				return html`
					<p class=warning>
						you must be logged in to plan subscriptions
					</p>
				`

			case PlanningSituation.Mode.Unprivileged:
				return html`
					<p class=warning>
						you're lacking privileges to plan subscriptions
					</p>
				`

			case PlanningSituation.Mode.Privileged:
				const {loadingPlans, loadingPlanCreation} =
					subscriptionPlanningModel.getLoadingViews()
				return renderWrappedInLoading(
					authModel.accessLoadingView,
					() => html`

						${renderWrappedInLoading(
							loadingPlans,
							plans => this.renderListOfSubscriptionPlans(plans)
						)}

						${renderWrappedInLoading(
							loadingPlanCreation,
							() => this.renderCreator()
						)}
					`
				)

			default:
				throw new Error("unknown planning situation mode")
		}
	}
}
