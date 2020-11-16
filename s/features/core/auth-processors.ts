
import {and} from "../../toolbox/dbby/dbby-helpers.js"
import {DbbyTable, ConstrainTables, DbbyRow} from "../../toolbox/dbby/dbby-types.js"
import {VerifyToken, AccessToken, AccessPayload, AppToken, AppPayload} from "./core-types.js"

export function prepareAuthProcessors<
		Tables extends {[key: string]: DbbyTable<DbbyRow>}
	>({verifyToken, constrainTables}: {
		verifyToken: VerifyToken
		constrainTables: ConstrainTables<Tables>
	}) {

	async function anonymousOnAnyApp({appToken}: {appToken: AppToken}) {
		const app = await verifyToken<AppPayload>(appToken)
		return {
			app,
			tables: <Tables>constrainTables(and({equal: {appId: app.appId}})),
		}
	}

	async function userOnAnyApp({appToken, accessToken}: {
			appToken: AppToken
			accessToken: AccessToken
		}) {
		return {
			...await anonymousOnAnyApp({appToken}),
			access: await verifyToken<AccessPayload>(accessToken),
		}
	}

	async function userOnPlatform(meta: {
			appToken: AppToken
			accessToken: AccessToken
		}) {
		const auth = await userOnAnyApp(meta)
		if (!auth.app.root) throw new Error("access this topic is restricted, platform-only")
		return auth
	}

	return {
		userOnAnyApp,
		userOnPlatform,
		anonymousOnAnyApp,
	}
}
