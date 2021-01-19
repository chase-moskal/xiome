
import {Business} from "renraku/x/types/primitives/business.js"

import {appTopic} from "../topics/app-topic.js"
import {mobxify} from "../../../framework/mobxify.js"

import {AccessPayload, AppDraft, AppPayload} from "../auth-types.js"

export function makeAppModel({getAccess, appService}: {
		getAccess: () => Promise<AccessPayload>
		appService: Business<ReturnType<typeof appTopic>>
	}) {

	return mobxify(new class {
		appList: AppPayload[] = []
		appDraft: AppDraft

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
