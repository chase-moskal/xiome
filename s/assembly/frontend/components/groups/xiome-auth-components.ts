
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {mixinHappy, mixinAutotrack, mixinShare} from "../../../../framework/component/component.js"
import {XiomeMyAvatar} from "../../../../features/auth/aspects/users/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "../../../../features/auth/aspects/users/components/my-account/xiome-my-account.js"
import {XiomeAppManager} from "../../../../features/auth/aspects/apps/components/app-manager/xiome-app-manager.js"
import {XiomeLoginPanel} from "../../../../features/auth/aspects/users/components/login-panel/xiome-login-panel.js"
import {XiomePermissions} from "../../../../features/auth/aspects/permissions/components/permissions/xiome-permissions.js"

export function xiomeAuthComponents({models, modals}: XiomeComponentOptions) {
	const {accessModel, appsModel, personalModel, permissionsModel} = models
	return {
		XiomeMyAvatar:
			mixinAutotrack(accessModel.track)(
				mixinShare({
					accessModel,
				})(XiomeMyAvatar)
			),
		XiomeLoginPanel:
			mixinAutotrack(accessModel.track)(
				mixinShare({
					accessModel,
				})(XiomeLoginPanel)
			),
		XiomeAppManager:
			mixinHappy(appsModel.onStateChange)(
				mixinShare({
					modals,
					appsModel,
				})(XiomeAppManager)
			),
		XiomeMyAccount:
			mixinAutotrack(accessModel.track)(
				mixinShare({
					accessModel,
					personalModel,
				})(XiomeMyAccount)
			),
		XiomePermissions:
			mixinHappy(permissionsModel.onStateChange)(
				mixinShare({
					modals,
					permissionsModel,
				})(XiomePermissions)
			),
	}
}
