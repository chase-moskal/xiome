
import {mixinShare, mixinSnapstateSubscriptions} from "../../../framework/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

import {XiomeAppManager} from "./apps/components/app-manager/xiome-app-manager.js"

import {XiomeMyAvatar} from "./users/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "./users/components/my-account/xiome-my-account.js"
import {XiomeLoginPanel} from "./users/components/login-panel/xiome-login-panel.js"

import {XiomePrivileges} from "./permissions/components/privileges/xiome-privileges.js"
import {XiomePermissions} from "./permissions/components/permissions/xiome-permissions.js"

export function integrateAuthComponents({models, modals}: XiomeComponentOptions) {
	const {accessModel, appsModel, personalModel, permissionsModel} = models
	return {
		XiomeMyAvatar:
			mixinSnapstateSubscriptions(accessModel.subscribe)(
				mixinShare({
					accessModel,
				})(XiomeMyAvatar)
			),
		XiomeLoginPanel:
			mixinSnapstateSubscriptions(accessModel.subscribe)(
				mixinShare({
					accessModel,
				})(XiomeLoginPanel)
			),
		XiomeAppManager:
			mixinSnapstateSubscriptions(appsModel.subscribe)(
				mixinShare({
					modals,
					appsModel,
				})(XiomeAppManager)
			),
		XiomeMyAccount:
			mixinSnapstateSubscriptions(personalModel.subscribe)(
				mixinShare({
					personalModel,
				})(XiomeMyAccount)
			),
		XiomePermissions:
			mixinSnapstateSubscriptions(permissionsModel.subscribe)(
				mixinShare({
					modals,
					permissionsModel,
				})(XiomePermissions)
			),
		XiomePrivileges:
			mixinSnapstateSubscriptions(permissionsModel.subscribe)(
				mixinShare({
					modals,
					permissionsModel,
				})(XiomePrivileges)
			),
	}
}
