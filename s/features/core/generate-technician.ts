
import {PlatformConfig} from "./core-types.js"
import {Rando} from "../../toolbox/get-rando.js"
import {writePasskey} from "./authtools/write-passkey.js"
import {digestPassword} from "../../toolbox/password/digest-password.js"
import {generatePasskey} from "./authtools/passkeytools/generate-passkey.js"

export async function generateTechnician(rando: Rando): Promise<{
			technicianPasskey: string
			technician: PlatformConfig["platform"]["technician"]
		}> {

	const passkeyPayload = generatePasskey(rando)
	const {passkeyId, secret} = passkeyPayload

	const passkey = writePasskey(passkeyPayload)
	const userId = rando.randomId()
	const salt = rando.randomId()
	const created = 1605306134182

	const digest = await digestPassword({salt, password: secret})

	return {
		technicianPasskey: passkey,
		technician: {
			account: {
				userId,
				created,
			},
			accountViaEmail: {
				userId,
				email,
			},
			// accountViaPasskey: {
			// 	userId,
			// 	passkeyId,
			// 	salt,
			// 	digest,
			// },
		},
	}
}
