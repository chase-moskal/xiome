
import "menutown"
import "./toolbox/mobx-necessary-hack.js"

import {getRando} from "./toolbox/get-rando.js"
import {assembleModels} from "./assembly/frontend/assemble-models.js"
import {mockBackend} from "./assembly/mock-backend.js"
import {mockRemote} from "./assembly/frontend/mocks/mock-remote.js"
import {makeTokenStore2} from "./features/auth/goblin/token-store2.js"
import {sendEmail} from "./features/auth/tools/emails/mock-send-email.js"
import {platformAppLabel} from "./features/auth/tests/helpers/constants.js"
import {registerComponents, share2, themeComponents} from "./framework/component.js"
import {prepareSendLoginEmail} from "./features/auth/tools/emails/send-login-email.js"
import {loginWithLinkTokenOrUseExistingLogin} from "./assembly/frontend/auth/login-with-link-token-or-use-existing-login.js"

import {readXiomeConfigElement} from "./assembly/frontend/read-xiome-config-element.js"

import {XioExample} from "./features/xio-components/example/xio-example.js"
import {XioLoading} from "./features/xio-components/loading/xio-loading.js"
import {XioTextInput} from "./features/xio-components/inputs/xio-text-input.js"
import {XiomeAppManager} from "./features/auth/components/apps/xiome-app-manager.js"
import {XiomeLoginPanel} from "./features/auth/components/login-panel/xiome-login-panel.js"
import {standardNicknameGenerator} from "./features/auth/tools/nicknames/standard-nickname-generator.js"

import theme from "./framework/theme.css.js"
import {assembleAndInitializeFrontend} from "./assembly/frontend/assemble-and-initialize-frontend.js"
import { makeRemote } from "./assembly/frontend/make-remote.js"

async function mockBackendAndRemote({apiLink, platformLink, technicianEmail}: {
		apiLink: string
		platformLink: string
		technicianEmail: string
	}) {
	const rando = await getRando()
	const backend = await mockBackend({
		rando,
		platformLink,
		platformAppLabel,
		technicianEmail,
		tableStorage: window.localStorage,
		sendLoginEmail: prepareSendLoginEmail({sendEmail}),
		generateNickname: standardNicknameGenerator({rando}),
	})
	const channel = new BroadcastChannel("tokenChangeEvent")
	const {remote, authGoblin} = mockRemote({
		api: backend.api,
		apiLink,
		appToken: backend.platformAppToken,
		tokenStore: makeTokenStore2({
			storage: window.localStorage,
			publishTokenChange: () => channel.postMessage(undefined),
		}),
		latency: {
			min: 200,
			max: 800,
		},
		origin: window.location.origin,
	})
	channel.onmessage = authGoblin.refreshFromStorage
	return {remote, authGoblin, backend}
}

async function connectRemote({apiLink}: {
		apiLink: string
	}) {
	const {appToken} = readXiomeConfigElement()
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
	return {remote, authGoblin}
}

const mock = true

/*

platform:
- full system mock
	- generates system with new platform token
- local api
	- connects to a node server with existing platform token
- normal production
	- connects to real server

app:
- full mock app
	- generates mock backend with new app and token
- local api
	- connects to node server using existing app token
- normal production
	- connects to real server using existing app token (xiome config)

*/

void async function platform() {
	const apiLink = "http://localhost:4999/"
	const {remote, authGoblin} = mock
		? await mockBackendAndRemote({
			apiLink,
			platformLink: "http://localhost:5000/",
			technicianEmail: "chase@xiome.io",
		})
		: await connectRemote({
			apiLink,
		})
	const {models} = await assembleAndInitializeFrontend({
		remote,
		authGoblin,
	})
	;(window as any).models = models
}()


async function installXiome() {
	const apiLink = "https://api.xiome.io/"
	
}
