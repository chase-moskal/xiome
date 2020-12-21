
import {observable, action} from "mobx"

import * as loading from "../../../toolbox/loading.js"
import {mixinModelMobx} from "../../../framework/mixin-model-mobx.js"
import {Personal, PersonalModelOptions} from "./types/personal-model-types.js"
import {Profile, GetAuthContext, AuthPayload} from "../auth-types.js"

 @mixinModelMobx
export class PersonalModel {
	@observable personalLoad: loading.Load<Personal> = loading.none()

	#options: PersonalModelOptions
	#getAuthContext: GetAuthContext

	constructor(options: PersonalModelOptions) {
		this.#options = options
	}

	 @action.bound
	private setPersonalLoad(personalLoad: loading.Load<Personal>) {
		this.personalLoad = personalLoad
	}

	 @action.bound
	async handleAuthLoad(authLoad: loading.Load<AuthPayload>) {
		this.setPersonalLoad(loading.select<AuthPayload, loading.Load<Personal>>(authLoad, {
			none: () => loading.none(),
			loading: () => loading.loading(),
			error: reason => loading.error(reason),
			ready: ({user}) => !!user
				? loading.loading()
				: loading.none(),
		}))

		const {user, getAuthContext} = loading.payload(authLoad) || {}
		this.#getAuthContext = getAuthContext
		const loggedIn = !!user
		if (loggedIn) {
			try {
				const {accessToken} = await getAuthContext()

				// TODO implement settings
				const settings = undefined
				// const settings = await this.settingsOperations.run(
				// 	this.settingsSheriff.fetchSettings({accessToken})
				// )

				this.setPersonalLoad(loading.ready({
					user,
					settings,
				}))
			}
			catch (error) {
				this.setPersonalLoad(loading.error("failed to load settings"))
				console.error(error)
			}
		}
	}

	 @action.bound
	async saveProfile(draft: Profile): Promise<void> {
		this.setPersonalLoad(loading.loading())
		try {
			if (!this.#getAuthContext) throw new Error("not logged in")
			const {accessToken, user} = await this.#getAuthContext()
			const authApi = this.#options.getAuthApi(accessToken)
			await authApi.personalTopic.setProfile({userId: user.userId, profile: draft})
			await this.#options.reauthorize()
		}
		catch (error) {
			this.setPersonalLoad(loading.error("failed to save profile"))
			throw error
		}
	}
}
