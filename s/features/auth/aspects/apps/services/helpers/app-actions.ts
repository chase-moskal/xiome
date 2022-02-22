
import * as dbmage from "dbmage"

import {AppDraft} from "../../types/app-draft.js"
import {AppDisplay} from "../../types/app-display.js"
import {originsToDatabase} from "../../../../utils/origins-to-database.js"
import {DatabaseSchema} from "../../../../../../assembly/backend/types/database.js"

export async function addApp({
		rando,
		appsDatabase,
		appDraft,
		ownerUserId: ownerUserIdString,
	}: {
		rando: dbmage.Rando
		appsDatabase: dbmage.Database<DatabaseSchema["apps"]>
		appDraft: AppDraft
		ownerUserId: string
	}): Promise<AppDisplay> {

	const ownerUserId = dbmage.Id.fromString(ownerUserIdString)
	const appId = rando.randomId()

	await Promise.all([
		appsDatabase.tables.registrations.create({
			appId,
			label: appDraft.label,
			home: appDraft.home,
			origins: originsToDatabase(appDraft.origins),
			archived: false,
		}),
		appsDatabase.tables.owners.create({
			appId,
			userId: ownerUserId,
		}),
	])
	return {
		...appDraft,
		appId: appId.toString(),
		stats: {
			users: 1,
			usersActiveDaily: 0,
			usersActiveMonthly: 0,
		},
	}
}
