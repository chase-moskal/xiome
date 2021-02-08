
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {AuthOptions, AppToken, App, GreenAuth} from "../auth-types.js"
import { isPlatform } from "../tools/is-platform.js"
import {originsFromDatabase} from "./origins/origins-from-database.js"

export const appTokenTopic = ({
		config,
		signToken,
	}: AuthOptions) => asTopic<GreenAuth>()({

	async authorizeApp({getAuthTables}, {appId}: {
			appId: string
		}): Promise<AppToken> {

		const tables = getAuthTables({appId})
		const appRow = await tables.app.one(find({appId}))
		if (appRow.archived) throw new ApiError(403, "app has been archived")

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
