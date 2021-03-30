
import {share2} from "../../../framework/component.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {XiomeBankConnect} from "../../../features/store/components/bank-connect/xiome-bank-connect.js"
import {XiomeSubscriptionPlanner} from "../../../features/store/components/subscription-planner/xiome-subscription-planner.js"

export function xiomeStoreComponents({models, modals}: XiomeComponentOptions) {
	const {authModel, bankModel, subscriptionPlanningModel} = models
	return {
		XiomeBankConnect: share2(XiomeBankConnect, {modals, authModel, bankModel}),
		XiomeSubscriptionPlanner: share2(XiomeSubscriptionPlanner, {modals, subscriptionPlanningModel}),
	}
}
