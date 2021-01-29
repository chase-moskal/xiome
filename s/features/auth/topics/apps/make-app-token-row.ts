
import {SignToken} from "redcrypto/dist/types.js"

import {day} from "../../../../toolbox/timely.js"
import {Rando} from "../../../../toolbox/get-rando.js"

import {AppRow, AppTokenRow} from "../../../../types.js"
import {AppPayload, AppTokenDraft} from "../../auth-types.js"

export async function makeAppTokenRow({rando, appRow, draft, signToken}: {
		rando: Rando
		appRow: AppRow
		draft: AppTokenDraft
		signToken: SignToken
	}) {

	const appTokenLifespan = 30 * day
	const appTokenId = rando.randomId()

	const app: AppPayload = {
		appId: appRow.appId,
		home: appRow.home,
		label: appRow.label,
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
