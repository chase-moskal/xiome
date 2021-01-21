
import {mobxify} from "../../../framework/mobxify.js"
import * as loading from "../../../toolbox/loading.js"
import {personalTopic} from "../topics/personal-topic.js"

import {Service} from "../../../types/service.js"
import {Personal} from "./types/personal-model-types.js"
import {Profile, AccessPayload} from "../auth-types.js"

export function makePersonalModel({personalService, getAccess, reauthorize}: {
		reauthorize: () => Promise<void>
		getAccess: () => Promise<AccessPayload>
		personalService: Service<typeof personalTopic>
	}) {
	return mobxify({

		personalLoad: loading.load<Personal>(),

		setPersonalLoad(load: loading.Load<Personal>) {
			this.personalLoad = load
		},

		acceptAccessLoad(accessLoad: loading.Load<AccessPayload>) {
			this.setPersonalLoad(
				loading.select<AccessPayload, loading.Load<Personal>>(accessLoad, {
					none: () => loading.none(),
					loading: () => loading.loading(),
					error: reason => loading.error(reason),
					ready: ({user}) => !!user
						? loading.loading()
						: loading.none()
				})
			)
			const user = loading.payload(accessLoad)?.user
			if (user) {
				try {
					// TODO get settings
					const settings = undefined
					this.setPersonalLoad(loading.ready({user, settings}))
				}
				catch (error) {
					this.setPersonalLoad(loading.error("error loading personal details"))
					console.error(error)
				}
			}
		},

		async saveProfile(draft: Profile): Promise<void> {
			this.setPersonalLoad(loading.loading())
			try {
				const access = await getAccess()
				if (!access) throw new Error("must be logged in")
				const {user} = access
				await personalService.setProfile({
					userId: user.userId,
					profile: draft,
				})
				await reauthorize()
			}
			catch (error) {
				this.setPersonalLoad(loading.error("failed to save profile"))
				throw error
			}
		},
	})
}
