
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {mixinAutotrack, mixinShare} from "../../../framework/component2/component2.js"
import {XiomeAppManager} from "../../../features/auth/components/apps/xiome-app-manager.js"
import {XiomeMyAvatar} from "../../../features/auth/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "../../../features/auth/components/my-account/xiome-my-account.js"
import {XiomeLoginPanel} from "../../../features/auth/components/login-panel/xiome-login-panel.js"
import {XiomePermissions} from "../../../features/auth/components/permissions/xiome-permissions.js"
import {mixinHappy} from "../../../framework/component2/mixins/mixin-happy.js"

export function xiomeAuthComponents({models, modals}: XiomeComponentOptions) {
	const {authModel, appModel, personalModel, permissionsModel} = models
	return {
		XiomeMyAvatar:
			mixinAutotrack(authModel.track)(
				mixinShare({
					authModel,
				})(XiomeMyAvatar)
			),
		XiomeLoginPanel:
			mixinAutotrack(authModel.track)(
				mixinShare({
					authModel,
				})(XiomeLoginPanel)
			),
		XiomeAppManager:
			mixinHappy(appModel.onStateChange)(
				mixinShare({
					modals,
					appModel,
				})(XiomeAppManager)
			),
		XiomeMyAccount:
			mixinAutotrack(authModel.track)(
				mixinShare({
					authModel,
					personalModel,
				})(XiomeMyAccount)
			),
		XiomePermissions:
			mixinHappy(permissionsModel.onStateChange)(
				mixinShare({
					modals,
					authModel,
					permissionsModel,
				})(XiomePermissions)
			),
	}
}
