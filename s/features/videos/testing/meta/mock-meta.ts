
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"

import {VideoMeta} from "../../types/video-auth.js"
import {AnonMeta} from "../../../auth/types/auth-metas.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"

async function mockUserMeta<xMeta extends AnonMeta>({
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
