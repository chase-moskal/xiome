
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {ConstrainTables} from "../../../toolbox/dbby/dbby-types.js"
import {AuthTables, VerifyToken, Profile, PlatformConfig} from "../auth-types.js"

import {validateProfile} from "./personal/validate-profile.js"
import {prepareUserOnAnyApp} from "./auth-processors/user-on-any-app.js"
import {doesUserHaveHardPrivilege} from "./personal/does-user-have-hard-privilege.js"

export function makePersonalTopic({
			config,
			verifyToken,
			constrainTables,
		}: {
			config: PlatformConfig
			verifyToken: VerifyToken
			constrainTables: ConstrainTables<AuthTables>
		}) {
	return processAuth(prepareUserOnAnyApp({verifyToken, constrainTables}), {

		async setProfile({access, app, tables}, {userId, profile}: {
					userId: string
					profile: Profile
				}) {
			const operationIsAllowed = doesUserHaveHardPrivilege({
				app,
				access,
				config,
				label: "edit_any_profile",
			})
			if (!operationIsAllowed) throw new Error("forbidden")
			const {problems} = validateProfile(profile)
			if (problems.length) throw new Error(`invalid profile: ${problems.join("; ")}`)
			await tables.profile.update({
				...find({userId}),
				write: profile,
			})
		},
	})
}
