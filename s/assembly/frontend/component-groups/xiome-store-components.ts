
import {wire3} from "../../../framework/component/wire3.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {XiomeEcommerce} from "../../../features/store/components/ecommerce/xiome-ecommerce.js"
import {XiomeBankConnect} from "../../../features/store/components/bank-connect/xiome-bank-connect.js"
import {XiomeSubscriptionPlanner} from "../../../features/store/components/subscription-planner/xiome-subscription-planner.js"

export function xiomeStoreComponents({models, modals}: XiomeComponentOptions) {
	const {storeModel} = models
	return {
		XiomeEcommerce: wire3(
			XiomeEcommerce, {
				modals,
				ecommerce: storeModel.shares.ecommerce,
			},
			storeModel.watch,
		),
		XiomeSubscriptionPlanner: wire3(
			XiomeSubscriptionPlanner,
			{
				modals,
				subscriptionPlanning: storeModel.shares.subscriptionPlanning,
			},
			storeModel.watch,
		),
		XiomeBankConnect: wire3(
			XiomeBankConnect,
			{
				modals,
				bank: storeModel.shares.bank,
			},
			storeModel.watch,
		),
	}
}
