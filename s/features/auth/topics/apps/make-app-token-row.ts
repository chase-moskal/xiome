
import {SignToken} from "redcrypto/dist/types.js"
import {ApiError} from "renraku/x/api/api-error.js"

import {Rando} from "../../../../toolbox/get-rando.js"
import {day} from "../../../../toolbox/goodtimes/times.js"

import {AppRow, AppTokenRow} from "../../../../types.js"
import {AppPayload, AppTokenDraft} from "../../auth-types.js"
import {validateAppTokenDraft} from "./validate-app-token-draft.js"

export async function makeAppTokenRow({rando, appRow, draft, signToken}: {
		rando: Rando
		appRow: AppRow
		draft: AppTokenDraft
		signToken: SignToken
	}) {

	const problems = validateAppTokenDraft(draft)
	if (problems.length !== 0)
		throw new ApiError(
			400,
			`app token draft failed validation: ${problems.join("; ")}`
		)

	const appTokenLifespan = 30 * day
	const appTokenId = rando.randomId()

	const app: AppPayload = {
		appId: appRow.appId,
		origins: draft.origins,
	}

	const expiry = Date.now() + appTokenLifespan
	const appToken = await signToken<AppPayload>({
		payload: app,
		lifespan: appTokenLifespan,
	})

	return <AppTokenRow>{
		expiry,
		appToken,
		appTokenId,
		appId: draft.appId,
		label: draft.label,
		origins: draft.origins.join(";"),
	}
}
