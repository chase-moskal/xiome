
import {DbbyTable, ConstrainTables, DbbyRow} from "../../toolbox/dbby/dbby-types.js"
import {VerifyToken, AccessToken, AccessPayload, AppToken, AppPayload} from "./core-types.js"

export function prepareAuthProcessors<
		Tables extends {[key: string]: DbbyTable<DbbyRow>}
	>({verifyToken, constrainTables}: {
		verifyToken: VerifyToken
		constrainTables: ConstrainTables<Tables>
	}) {

	async function authForApp({appToken}: {appToken: AppToken}) {
		const app = await verifyToken<AppPayload>(appToken)
		return {
			app,
			tables: <Tables>constrainTables({appId: app.appId}),
		}
	}

	async function authForUser({appToken, accessToken}: {
			appToken: AppToken
			accessToken: AccessToken
		}) {
		return {
			...await authForApp({appToken}),
			access: await verifyToken<AccessPayload>(accessToken),
		}
	}

	async function authForRootUser(meta: {
			appToken: AppToken
			accessToken: AccessToken
		}) {
		const auth = await authForUser(meta)
		if (!auth.app.root) throw new Error("apps topic is root-only")
		return auth
	}

	return {
		authForApp,
		authForUser,
		authForRootUser,
	}
}
