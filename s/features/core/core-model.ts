
import {CoreApi, User} from "./core-types.js"
import * as mobb from "../../framework/mobb.js"

export function makeCoreModel({coreApi}: {
		coreApi: CoreApi
	}) {

	const observables = mobb.observables({
		authLoad: undefined,
	})

	const computes = mobb.computeds({
		get user(): User {
			return observables.authLoad?.user
		}
	})

	const actions = mobb.actions({
		async useExistingLogin() {},
		async loginWithAccessToken() {},
		async login() {},
		async logout() {},
	})

	return {
		...observables,
		...computes,
		...actions,
	}
}

// // import {curryTopicMeta} from "renraku/dist/curries.js"

// import {MetalUser} from "../../types.js"
// import {pubsub} from "../../toolbox/pubsub.js"
// import {AuthPayload} from "../../metalfront/types.js"
// import * as loading from "../../metalfront/toolbox/loading.js"

// import {AuthApi, AppsTopic, AuthTopic, UserTopic} from "./auth-types.js"

// export class AuthModel {
// 	private appsTopic: AppsTopic
// 	private authTopic: AuthTopic
// 	private userTopic: UserTopic

// 	constructor({authApi}: {
// 			authApi: AuthApi
// 		}) {
// 		// this.appsTopic = curryTopicMeta(authApi.appsTopic, async(meta) => ({}))
// 		this.appsTopic = authApi.appsTopic
// 		this.authTopic = authApi.authTopic
// 		this.userTopic = authApi.userTopic
// 	}
// }
