
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"

import {AnonMeta} from "../../features/auth/types/auth-metas.js"
import {AccessPayload} from "../../features/auth/types/auth-tokens.js"
import {minute} from "../../toolbox/goodtimes/times.js"

export async function mockMeta<xMeta extends AnonMeta>({
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
