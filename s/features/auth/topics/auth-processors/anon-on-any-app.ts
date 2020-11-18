
import {and} from "../../../../toolbox/dbby/dbby-helpers.js"
import {VerifyToken, AppToken, AppPayload} from "./../../auth-types.js"
import {DbbyTable, ConstrainTables, DbbyRow} from "../../../../toolbox/dbby/dbby-types.js"

export function prepareAnonOnAnyApp<Tables extends {[key: string]: DbbyTable<DbbyRow>}>({
			verifyToken,
			constrainTables,
		}: {
			verifyToken: VerifyToken
			constrainTables: ConstrainTables<Tables>
		}) {

	return async({appToken}: {appToken: AppToken}) => {
		const app = await verifyToken<AppPayload>(appToken)
		return {
			app,
			tables: <Tables>constrainTables(and({equal: {appId: app.appId}})),
		}
	}
}
