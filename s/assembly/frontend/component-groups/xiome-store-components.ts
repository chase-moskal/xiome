
import {share2} from "../../../framework/component.js"
import {wire3} from "../../../framework/component/wire3.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {XiomeEcommerce} from "../../../features/store/components/ecommerce/xiome-ecommerce.js"
import {XiomeBankConnect} from "../../../features/store/components/bank-connect/xiome-bank-connect.js"
import {XiomeSubscriptionPlanner} from "../../../features/store/components/subscription-planner/xiome-subscription-planner.js"

export function xiomeStoreComponents({models, modals}: XiomeComponentOptions) {
	const {authModel, bankModel, subscriptionPlanningModel, ecommerceModel, storeModel} = models
	return {
		XiomeBankConnect: share2(XiomeBankConnect, {modals, authModel, bankModel}),
		XiomeSubscriptionPlanner: share2(XiomeSubscriptionPlanner, {modals, authModel, subscriptionPlanningModel}),
		XiomeEcommerce: wire3(XiomeEcommerce, {modals, ...storeModel.shares}, storeModel.watch),
	}
}
