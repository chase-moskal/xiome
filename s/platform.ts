
import "menutown"

import {getRando} from "./toolbox/get-rando.js"
import {assembleModels} from "./assembly/assemble-models.js"
import {mockWholeSystem} from "./assembly/mock-whole-system.js"
import {mockRemote} from "./assembly/frontend/mocks/mock-remote.js"
import {makeTokenStore2} from "./features/auth/goblin/token-store2.js"
import {sendEmail} from "./features/auth/tools/emails/mock-send-email.js"
import {platformAppLabel} from "./features/auth/tests/helpers/constants.js"
import {registerComponents, share2, themeComponents} from "./framework/component.js"
import {prepareSendLoginEmail} from "./features/auth/tools/emails/send-login-email.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./assembly/frontend/login-with-link-token-or-use-existing-login.js"

import {XioExample} from "./features/xio-components/example/xio-example.js"
import {XioLoading} from "./features/xio-components/loading/xio-loading.js"
import {XioTextInput} from "./features/xio-components/inputs/xio-text-input.js"
import {XiomeAppManager} from "./features/auth/components/apps/xiome-app-manager.js"
import {XiomeLoginPanel} from "./features/auth/components/login-panel/xiome-login-panel.js"
import {standardNicknameGenerator} from "./features/auth/tools/nicknames/standard-nickname-generator.js"

import theme from "./theme.css.js"

void async function platform() {
	const rando = await getRando()
	const platformLink = "http://localhost:5000/"
	const system = await mockWholeSystem({
		rando,
		platformLink,
		platformAppLabel,
		technicianEmail: "chasemoskal@gmail.com",
		tableStorage: window.localStorage,
		sendLoginEmail: prepareSendLoginEmail({sendEmail}),
		generateNickname: standardNicknameGenerator({rando}),
	})

	const channel = new BroadcastChannel("tokenChangeEvent")
	const {remote, authGoblin} = mockRemote({
		api: system.api,
		apiLink: "http://localhost:5001/",
		appToken: system.platformAppToken,
		tokenStore: makeTokenStore2({
			storage: window.localStorage,
			publishTokenChange: () => channel.postMessage(undefined),
		}),
		latency: {
			min: 200,
			max: 800,
		},
		origin: new URL(platformLink).origin,
	})
	channel.onmessage = authGoblin.refreshFromStorage

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

	;(window as any).system = system
	;(window as any).models = models
}()
