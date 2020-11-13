
import {nap} from "../../../../toolbox/nap.js"
import {incorrectPasskeyPenalty} from "../../core-constants.js"

export class InvalidPasskeyError extends Error {}

export async function invalidPasskeyError() {
	await nap(incorrectPasskeyPenalty)
	throw new InvalidPasskeyError("invalid passkey")
}
