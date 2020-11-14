
import {Rando} from "../../../toolbox/get-rando.js"
import {and} from "../../../toolbox/dbby/dbby-helpers.js"

import {parsePasskey} from "./passkeytools/parse-passkey.js"
import {invalidPasskeyError} from "./passkeytools/invalid-passkey-error.js"
import {verifyCorrectPasskey} from "./passkeytools/verify-correct-passkey.js"
import {AppPayload, CoreTables, PasskeyPayload, PlatformConfig} from "../core-types.js"

async function matchHardcodedTechnicianAccount({app, rando, config, passkeyPayload}: {
			rando: Rando
			app: AppPayload
			config: PlatformConfig
			passkeyPayload: PasskeyPayload
		}): Promise<{userId: string}> {

	const appIsRoot = !!app.root
	const {passkeyId, secret} = passkeyPayload
	const {account, accountViaPasskey} = config.platform.technician
	const passkeyIsForTechnician = rando.compare(
		passkeyId,
		accountViaPasskey.passkeyId,
	)

	if (appIsRoot && passkeyIsForTechnician) {
		const passkeyIsCorrect: boolean = await verifyCorrectPasskey({
			rando,
			secret: secret,
			passkeyRow: accountViaPasskey,
		})
		if (passkeyIsCorrect) return {
			userId: account.userId,
		}
	}

	await invalidPasskeyError()
}

async function matchExistingPasskeyAccount({rando, passkeyPayload, tables}: {
			rando: Rando
			tables: CoreTables
			passkeyPayload: PasskeyPayload
		}): Promise<{userId: string}> {

	const {passkeyId, secret} = passkeyPayload
	const passkeyRow = await tables.accountViaPasskey.one({
		conditions: and({equal: {passkeyId}})
	})

	const passkeyIsCorrect: boolean = (!!passkeyRow)
		&& await verifyCorrectPasskey({rando, passkeyRow, secret})

	if (passkeyIsCorrect) return {userId: passkeyRow.userId}
	else await invalidPasskeyError()
}

export async function verifyPasskeyAccount({
			app,
			rando,
			config,
			tables,
			passkey,
		}: {
			rando: Rando
			app: AppPayload
			passkey: string
			tables: CoreTables
			config: PlatformConfig
		}): Promise<{userId: string}> {

	const passkeyPayload = parsePasskey(passkey)

	return (
		await matchHardcodedTechnicianAccount({app, rando, passkeyPayload, config})
			||
		await matchExistingPasskeyAccount({rando, tables, passkeyPayload})
	)
}
