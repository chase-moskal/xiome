
import "menutown"
import "./toolbox/mobx-necessary-hack.js"

import {assembleModels} from "./assembly/frontend/assemble-models.js"
import {makeRemote} from "./assembly/frontend/make-remote.js"
import {makeTokenStore2} from "./features/auth/goblin/token-store2.js"
import {registerComponents, share2, themeComponents} from "./framework/component.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./assembly/frontend/auth/login-with-link-token-or-use-existing-login.js"

import {XioExample} from "./features/xio-components/example/xio-example.js"
import {XioLoading} from "./features/xio-components/loading/xio-loading.js"
import {XioTextInput} from "./features/xio-components/inputs/xio-text-input.js"
import {XiomeAppManager} from "./features/auth/components/apps/xiome-app-manager.js"
import {XiomeLoginPanel} from "./features/auth/components/login-panel/xiome-login-panel.js"

import theme from "./framework/theme.css.js"
import {assembleAndInitializeFrontend} from "./assembly/frontend/assemble-and-initialize-frontend.js"

void async function platform() {
	const apiLink = "http://localhost:4999/"



	const xiomeConfig = document.querySelector("xiome-config")
	if (!xiomeConfig) throw new Error(`<xiome-config> is required`)
	const appToken = xiomeConfig.getAttribute("token")

	const channel = new BroadcastChannel("tokenChangeEvent")
	const {remote, authGoblin} = makeRemote({
		apiLink,
		appToken,
		tokenStore: makeTokenStore2({
			storage: window.localStorage,
			publishTokenChange: () => channel.postMessage(undefined),
		}),
	})
	channel.onmessage = authGoblin.refreshFromStorage


	const {models} = await assembleAndInitializeFrontend({
		remote,
		authGoblin,
	})

	;(window as any).models = models
}()
