
import {Await} from "../../types/fancy.js"
import theme from "../../framework/theme.css.js"
import {assembleModels} from "./assemble-models.js"
import {ModalSystem} from "./modal/types/modal-system.js"
import {share2, themeComponents} from "../../framework/component.js"

import {XioButton} from "../../features/xio-components/button/xio-button.js"
import {XioExample} from "../../features/xio-components/example/xio-example.js"
import {XioLoading} from "../../features/xio-components/loading/xio-loading.js"
import {XioTextInput} from "../../features/xio-components/inputs/xio-text-input.js"
import {XiomeAppManager} from "../../features/auth/components/apps/xiome-app-manager.js"
import {XiomeMyAvatar} from "../../features/auth/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "../../features/auth/components/my-account/xiome-my-account.js"
import {XioProfileCard} from "../../features/xio-components/profile-card/xio-profile-card.js"
import {XiomeLoginPanel} from "../../features/auth/components/login-panel/xiome-login-panel.js"
import {XiomePermissions} from "../../features/auth/components/permissions/xiome-permissions.js"


export function getComponents({models, modals}: {
		modals: ModalSystem
		models: Await<ReturnType<typeof assembleModels>>
	}) {
	const {authModel, appModel, personalModel, permissionsModel} = models
	return themeComponents(theme, {
		XioButton,
		XioExample,
		XioLoading,
		XioTextInput,
		XioProfileCard,
		XiomeMyAvatar: share2(XiomeMyAvatar, {authModel}),
		XiomeLoginPanel: share2(XiomeLoginPanel, {authModel}),
		XiomeAppManager: share2(XiomeAppManager, {appModel, modals}),
		XiomeMyAccount: share2(XiomeMyAccount, {authModel, personalModel}),
		XiomePermissions: share2(XiomePermissions, {authModel, modals, permissionsModel}),
	})
}
