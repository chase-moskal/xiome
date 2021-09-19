
import {VideoAuth, VideoMeta} from "../types/video-auth.js"
import {VideoTables} from "../types/video-tables.js"
import {AnonMeta, UserMeta} from "../../auth/types/auth-metas.js"
import {minute} from "../../../toolbox/goodtimes/times.js"
import {AuthTables} from "../../auth/types/auth-tables.js"
import {videoPrivileges} from "../api/video-privileges.js"
import {Permit} from "../../auth/aspects/permissions/types/permit.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"
import {makePrivilegeChecker} from "../../auth/aspects/permissions/tools/make-privilege-checker.js"

export async function mockUserMeta<xMeta extends AnonMeta>({
		access,
		lifespan = minute * 10,
	}: {
		access: AccessPayload
		lifespan?: number
	}) {

	const signToken = mockSignToken()
	return <xMeta>{
		accessToken: await signToken({
			lifespan,
			payload: access,
		})
	}
}

export async function mockVideoMeta({userId, origins, privileges}: {
		userId: string
		origins: string[]
		privileges: string[]
	}) {
	return mockUserMeta<VideoMeta>({
		access: {
			appId: "",
			origins,
			permit: {privileges},
			scope: {core: true},
			user: {
				userId,
				profile: {
					avatar: undefined,
					nickname: "Steven Seagal",
					tagline: "totally ripped and sweet",
				},
				roles: [],
				stats: {joined: Date.now()},
			},
		},
	})
}

// export function mockVideoAuth({
// 		userId, privileges, authTables, videoTables,
// 	}: {
// 		userId: string
// 		privileges: string[]
// 		authTables: AuthTables
// 		videoTables: VideoTables
// 	}): VideoAuth {

// 	const permit: Permit = {privileges}

// 	const access: AccessPayload = {
// 		appId: "",
// 		origins: [],
// 		permit,
// 		scope: {core: true},
// 		user: {
// 			userId,
// 			profile: {
// 				avatar: undefined,
// 				nickname: "Steven Seagal",
// 				tagline: "totally ripped and sweet",
// 			},
// 			roles: [],
// 			stats: {joined: Date.now()},
// 		},
// 	}

// 	return {
// 		access,
// 		authTables,
// 		videoTables,
// 		checker: makePrivilegeChecker(permit, videoPrivileges),
// 	}
// }
