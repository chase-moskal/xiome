
import {mobxify} from "../../../framework/mobxify.js"

import {AppDraft, AppPayload} from "../auth-types.js"
import {AppModelOptions} from "./types/app/app-model-options.js"

export function makeAppModel({appService, getAccess}: AppModelOptions) {

	return mobxify(new class {
		appList: AppPayload[] = []
		appDraft: AppDraft = undefined

		setListing(apps: AppPayload[]) {
			this.appList = apps
		}

		setAppDraft(draft: AppDraft) {
			this.appDraft = draft
		}

		async loadAppListing() {
			const access = await getAccess()
			if (!access) throw new Error("must be logged in")
			const ownerUserId = access.user.userId
			const apps = await appService.listApps({ownerUserId})
			this.setListing(apps)
		}

		async submitAppDraftForRegistration() {
			const {appDraft} = this
			if (!appDraft) throw new Error("no app draft to register")
			const access = await getAccess()
			if (!access) throw new Error("must be logged in")
			const {appId} = await appService.registerApp({
				appDraft,
				ownerUserId: access.user.userId,
			})
			await this.loadAppListing()
		}
	})
}