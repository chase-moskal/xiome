
import {CoreTables} from "../core-types.js"

export async function assertPasskeyAccount({passkey, tables}: {
			passkey: string
			tables: CoreTables
		}): Promise<{userId: string}> {
	throw new Error("TODO implement")
}
