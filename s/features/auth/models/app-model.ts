
import {observable, action} from "mobx"

import {AppDraft, AppPayload} from "../auth-types.js"
import {AppModelOptions} from "./types/app-model-types.js"
import {mixinModelMobx} from "../../../framework/mixin-model-mobx.js"

 @mixinModelMobx
export class AppModel {
	#options: AppModelOptions

	constructor(options: AppModelOptions) {
		this.#options = options
	}

	//
	// mobx observables and actions
	//

	 @observable
	listing: AppPayload[] = []

	 @observable
	draft: AppDraft

	 @action.bound
	setListing(apps: AppPayload[]) {
		this.listing = apps
	}

	 @action.bound
	setAppDraft(draft: AppDraft) {
		this.draft = draft
	}

	//
	// methods
	//

	async loadAppListing() {
		const {user, appTopic} = await this.getAppTopic()
		const apps = await appTopic.listApps({ownerUserId: user.userId})
		this.setListing(apps)
	}

	async submitAppDraftForRegistration() {
		const {draft} = this
		if (!draft) throw new Error("no draft to register")
		const {user, appTopic} = await this.getAppTopic()
		await appTopic.registerApp({
			appDraft: this.draft,
			ownerUserId: user.userId,
		})
		await this.loadAppListing()
	}

	//
	// private methods
	//

	private async getAppTopic() {
		const {getAuthContext} = this.#options.authModel
		if (!getAuthContext) throw new Error("must be logged in")
		const {accessToken, user} = await getAuthContext()
		const {appTopic} = this.#options.getAuthApi(accessToken)
		return {user, appTopic}
	}
}
