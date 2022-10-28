
import {makeStoreModel} from "../../../model/model.js"

export function getActiveAndAllowedPlans(
		element: HTMLElement,
		storeModel: ReturnType<typeof makeStoreModel>
	) {

	const allowedPlans = (
		element["allow-plans"]
			?.match(/(\w+)/g)
	)

	const plans = (
		storeModel
			.get
			.subscriptions
			.plans
				?? []
	)

	const activePlans = (
		plans
			.filter(plan => !plan.archived)
			.filter(plan => plan.tiers.length)
	)

	return (
		!!element["allow-plans"]
			? activePlans.filter(plan => allowedPlans.includes(plan.planId))
			: activePlans
	)
}
