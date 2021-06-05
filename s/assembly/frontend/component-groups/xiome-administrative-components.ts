
import {mixinShare} from "../../../framework/component2/component2.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {mixinHappy} from "../../../framework/component2/mixins/mixin-happy.js"
import {XiomeManageUsers} from "../../../features/administrative/components/xiome-manage-users.js"

export function xiomeAdministrativeComponents({models, modals}: XiomeComponentOptions) {
	const {administrativeModel} = models
	return {
		XiomeManageUsers: mixinHappy(administrativeModel.onStateChange)(
			mixinShare({
				modals,
				administrativeModel,
			})(XiomeManageUsers)
		),
	}
}
