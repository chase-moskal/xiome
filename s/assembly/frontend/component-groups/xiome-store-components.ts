
// // TODO reactivate store

// import {XiomeComponentOptions} from "./types/xiome-component-options.js"
// import {mixinShare, mixinAutotrack} from "../../../framework/component2/component2.js"
// import {XiomeEcommerce} from "../../../features/store/components/ecommerce/xiome-ecommerce.js"
// import {XiomeBankConnect} from "../../../features/store/components/bank-connect/xiome-bank-connect.js"
// import {XiomeSubscriptionPlanner} from "../../../features/store/components/subscription-planner/xiome-subscription-planner.js"

// export function xiomeStoreComponents({models, modals}: XiomeComponentOptions) {
// 	const {storeModel} = models
// 	return {
// 		XiomeEcommerce:
// 			mixinAutotrack(storeModel.track)(
// 				mixinShare({
// 					modals,
// 					ecommerce: storeModel.shares.ecommerce,
// 				})(XiomeEcommerce)
// 			),
// 		XiomeSubscriptionPlanner:
// 			mixinAutotrack(storeModel.track)(
// 				mixinShare({
// 					modals,
// 					subscriptionPlanning: storeModel.shares.subscriptionPlanning,
// 				})(XiomeSubscriptionPlanner)
// 			),
// 		XiomeBankConnect:
// 			mixinAutotrack(storeModel.track)(
// 				mixinShare({
// 					modals,
// 					bank: storeModel.shares.bank,
// 				})(XiomeBankConnect)
// 			),
// 	}
// }
