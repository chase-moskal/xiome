
import {mobxify} from "../../../framework/mobxify.js"

import {Profile} from "../auth-types.js"
import {PersonalModelOptions} from "./types/personal/personal-model-options.js"

export function makePersonalModel({
		personalService,
		getAccess,
		reauthorize,
	}: PersonalModelOptions) {

	return mobxify(new class {
		// personalLoad = loading.load<Persona>()

		// setPersonalLoad(load: loading.Load<Persona>) {
		// 	this.personalLoad = load
		// }

		// acceptAccessLoad(accessLoad: loading.Load<AccessPayload>) {
		// 	this.setPersonalLoad(
		// 		loading.select<AccessPayload, loading.Load<Persona>>(accessLoad, {
		// 			none: () => loading.none(),
		// 			loading: () => loading.loading(),
		// 			error: reason => loading.error(reason),
		// 			ready: access => !!access
		// 				? loading.loading()
		// 				: loading.none()
		// 		})
		// 	)
		// 	const user = loading.payload(accessLoad)?.user
		// 	if (user) {
		// 		try {
		// 			// TODO get settings
		// 			const settings = undefined
		// 			this.setPersonalLoad(loading.ready({user, settings}))
		// 		}
		// 		catch (error) {
		// 			this.setPersonalLoad(loading.error("error loading personal details"))
		// 			console.error(error)
		// 		}
		// 	}
		// }

		async saveProfile(draft: Profile): Promise<void> {
			// this.setPersonalLoad(loading.loading())
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
				// this.setPersonalLoad(loading.error("failed to save profile"))
				throw error
			}
		}
	})
}
