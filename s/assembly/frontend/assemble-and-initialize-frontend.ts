
import {ToRemote} from "renraku/x/types/remote/to-remote"

import {assembleModels} from "./assemble-models.js"
import {makeRemote} from "./make-remote.js"
import {makeTokenStore2} from "../../features/auth/goblin/token-store2.js"
import {registerComponents, share2, themeComponents} from "../../framework/component.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./auth/login-with-link-token-or-use-existing-login.js"

import {XioExample} from "../../features/xio-components/example/xio-example.js"
import {XioLoading} from "../../features/xio-components/loading/xio-loading.js"
import {XioTextInput} from "../../features/xio-components/inputs/xio-text-input.js"
import {XiomeAppManager} from "../../features/auth/components/apps/xiome-app-manager.js"
import {XiomeLoginPanel} from "../../features/auth/components/login-panel/xiome-login-panel.js"

import theme from "../../theme.css.js"
import {SystemApi} from "../types/backend/system-api.js"
import {AuthGoblin} from "../../features/auth/goblin/types/auth-goblin.js"

export async function assembleAndInitializeFrontend({authGoblin, remote}: {
		authGoblin: AuthGoblin
		remote: ToRemote<SystemApi>
	}) {

	const models = await assembleModels({
		remote,
		authGoblin,
		link: window.location.toString(),
	})

	registerComponents(themeComponents(theme, {
		XioExample,
		XioLoading,
		XioTextInput,
		XiomeAppManager: share2(XiomeAppManager, {appModel: models.appModel}),
		XiomeLoginPanel: share2(XiomeLoginPanel, {authModel: models.authModel}),
	}))

	await loginWithLinkTokenOrUseExistingLogin({
		authModel: models.authModel,
		link: window.location.toString(),
	})

	return {models}
}
