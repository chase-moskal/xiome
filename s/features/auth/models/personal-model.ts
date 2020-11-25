
import {observable, action} from "mobx"
import {AddMetaApi} from "renraku/dist/types.js"
import {addMetaTopic, addMetaApi} from "renraku/dist/curries.js"

import {GetApi} from "../../../types.js"
import * as loading from "../../../toolbox/loading.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"

import {User, Settings, Profile, AuthApi, GetAuthContext, AuthPayload, AccessToken, AppToken} from "../auth-types.js"

export function authorizeTopics({authApi, appToken, accessToken}: {
			authApi: AuthApi
			appToken: string
			accessToken: string
		}) {
	return addMetaApi(async() => ({appToken, accessToken}), authApi)
}

export interface Personal {
	user: User
	settings: Settings
}

export interface PersonalModelOptions {
	getAuthApi: GetApi<AuthApi>
	reauthorize: () => Promise<void>
}

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

// import {MetalUser, MetalProfile, MetalSettings, SettingsSheriffTopic, UserUmbrellaTopic} from "../../types.js"

// export class PersonalModel {
// 	@observable personalLoad: loading.Load<Personal> = loading.none()

// 	@computed get personal() {
// 		return loading.payload(this.personalLoad)
// 	}

// 	@computed get user() {
// 		return this.personal?.user
// 	}

// 	@computed get settings() {
// 		return this.personal?.settings
// 	}

// 	private getAuthContext: GetAuthContext<MetalUser>

// 	private logger: Logger
// 	private reauthorize: () => Promise<void>
// 	private userUmbrella: UserUmbrellaTopic<MetalUser>
// 	private settingsOperations = makeOperationsCenter()
// 	private settingsSheriff: SettingsSheriffTopic<MetalSettings>

// 	constructor(options: {
// 			logger: Logger
// 			reauthorize: () => Promise<void>
// 			userUmbrella: UserUmbrellaTopic<MetalUser>
// 			settingsSheriff: SettingsSheriffTopic<MetalSettings>
// 		}) {
// 		Object.assign(this, options)
// 	}

// 	 @action.bound
// 	async handleAuthLoad(authLoad: loading.Load<AuthPayload<MetalUser>>) {
// 		this.setPersonalLoad(loading.select<AuthPayload<MetalUser>, loading.Load<Personal>>(authLoad, {
// 			none: () => loading.none(),
// 			loading: () => loading.loading(),
// 			error: reason => loading.error(reason),
// 			ready: ({user}) => !!user
// 				? loading.loading()
// 				: loading.none(),
// 		}))

// 		const {user, getAuthContext} = loading.payload(authLoad) || {}
// 		this.getAuthContext = getAuthContext
// 		const loggedIn = !!user

// 		if (loggedIn) {
// 			try {
// 				const {accessToken} = await getAuthContext()
// 				const settings = await this.settingsOperations.run(
// 					this.settingsSheriff.fetchSettings({accessToken})
// 				)
// 				this.setPersonalLoad(loading.ready({
// 					user,
// 					settings,
// 				}))
// 			}
// 			catch (error) {
// 				this.setPersonalLoad(loading.error("failed to load settings"))
// 				console.error(error)
// 			}
// 		}
// 	}

// 	 @action.bound
// 	async saveProfile(draft: MetalProfile): Promise<void> {
// 		this.setPersonalLoad(loading.loading())
// 		try {
// 			const {getAuthContext} = this
// 			if (!getAuthContext) throw new Error("not logged in")
// 			const {accessToken, user} = await getAuthContext()
// 			await this.userUmbrella.setProfile({
// 				accessToken,
// 				profile: draft,
// 				userId: user.userId,
// 			})
// 			await this.reauthorize()
// 		}
// 		catch (error) {
// 			this.setPersonalLoad(loading.error("failed to save profile"))
// 			throw error
// 		}
// 	}

// 	//  @action.bound
// 	// async setAdminMode(adminMode: boolean): Promise<void> {
// 	// 	if (!this.personal) throw new Error("personal not loaded")
// 	// 	const {accessToken} = await this.getAuthContext()
// 	// 	const settings = await this.settingsSheriff.setActAsAdmin({
// 	// 		accessToken,
// 	// 		actAsAdmin: adminMode,
// 	// 	})
// 	// 	const {user} = this.personal
// 	// 	this.setPersonalLoad(loading.ready({user, settings}))
// 	// }

// 	// TODO implement avatar publicity

// 	//  @action.bound
// 	// async setAvatarPublicity(avatarPublicity: boolean): Promise<void> {
// 	// 	if (!this.personal) throw new Error("personal not loaded")
// 	// 	const {user, accessToken} = await this.getAuthContext()
// 	// 	const {settings, profile} = await this.settingsSheriff.setAvatarPublicity({
// 	// 		accessToken,
// 	// 		avatarPublicity,
// 	// 	})
// 	// 	this.setPersonalLoad(loading.ready({user, profile, settings}))
// 	// }

// 	 @action.bound
// 	private setPersonalLoad(personalLoad: loading.Load<Personal>) {
// 		this.personalLoad = personalLoad
// 	}
// }
