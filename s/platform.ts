
import {assembleModels} from "./assembly/assemble-models.js"
import {mockWholeSystem} from "./assembly/mock-whole-system.js"
import {mockRemote} from "./assembly/frontend/mocks/mock-remote.js"
import {makeTokenStore2} from "./features/auth/goblin/token-store2.js"
import {sendEmail} from "./features/auth/tools/emails/mock-send-email.js"
import { platformAppLabel } from "./features/auth/tests/helpers/constants.js"
import {registerComponents, share, themeComponents} from "./framework/component.js"
import {prepareSendLoginEmail} from "./features/auth/tools/emails/send-login-email.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./assembly/frontend/login-with-link-token-or-use-existing-login.js"

import {ZapExample} from "./features/zapcomponents/example/zap-example.js"
import {ZapLoading} from "./features/zapcomponents/loading/zap-loading.js"
import {AuthPanel} from "./features/auth/components/login-panel/auth-panel.js"

import theme from "./theme.css.js"

void async function platform() {
	const system = await mockWholeSystem({
		platformAppLabel,
		platformLink: "http://localhost:5000/",
		technicianEmail: "chasemoskal@gmail.com",
		tableStorage: window.localStorage,
		sendLoginEmail: prepareSendLoginEmail({sendEmail}),
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
	})

	const models = await assembleModels({
		remote,
		authGoblin,
		link: window.location.toString(),
	})

	registerComponents(themeComponents(theme, {
		ZapExample,
		ZapLoading,
		AuthPanel: share(AuthPanel, () => models.authModel),
	}))

	await loginWithLinkTokenOrUseExistingLogin({
		authModel: models.authModel,
		link: window.location.toString(),
	})

	channel.onmessage = models.authModel.useExistingLogin

	;(window as any).system = system
	;(window as any).models = models
}()
