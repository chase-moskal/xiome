
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, VerifyToken, Profile, PlatformConfig, AppPayload, AccessPayload, GetTables} from "../auth-types.js"

import {validateProfile} from "./personal/validate-profile.js"
import {processRequestForUser} from "./auth-processors/process-request-for-user.js"

function isUserAllowedToEditProfile({app, access}: {
		app: AppPayload
		tables: AuthTables
		access: AccessPayload
		config: PlatformConfig
	}) {
	// TODO implement
	return true
}

export function makePersonalTopic({
			config,
			getTables,
			verifyToken,
		}: {
			config: PlatformConfig
			verifyToken: VerifyToken
			getTables: GetTables<AuthTables>
		}) {
	return processAuth(processRequestForUser({verifyToken, getTables}), {

		async setProfile({access, app, tables}, {userId, profile}: {
					userId: string
					profile: Profile
				}) {

			const allowed = isUserAllowedToEditProfile({
				app,
				access,
				config,
				tables,
			})

			if (!allowed) throw new Error("forbidden")

			const {problems} = validateProfile(profile)

			if (problems.length) throw new Error(`invalid profile: ${problems.join("; ")}`)

			await tables.profile.update({
				...find({userId}),
				write: profile,
			})
		},
	})
}
