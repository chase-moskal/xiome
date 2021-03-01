
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {isPlatform} from "../tools/is-platform.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {originsFromDatabase} from "./origins/origins-from-database.js"
import {App} from "../types/app.js"
import {AppToken} from "../types/app-token.js"
import {GreenAuth} from "../policies/types/green-auth.js"
import {AuthApiOptions} from "../types/auth-api-options"

export const appTokenTopic = ({
			config,
			signToken,
		}: AuthApiOptions) => asTopic<GreenAuth>()({

	async authorizeApp({bakeTables}, {appId}: {
				appId: string
			}): Promise<AppToken> {

		const tables = await bakeTables(appId)
		const appRow = await tables.app.app.one(find({appId}))

		if (!appRow)
			throw new ApiError(400, "incorrect app id")

		if (appRow.archived)
			throw new ApiError(403, "app has been archived")

		return signToken<App>({
			lifespan: config.tokens.lifespans.app,
			payload: {
				appId,
				permissions: undefined,
				platform: isPlatform(appId, config),
				origins: originsFromDatabase(appRow.origins),
			},
		})
	},
})
