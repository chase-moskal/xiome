
import {GoogleResult} from "./core-types.js"

export async function mockSignGoogleToken(
		googleResult: GoogleResult
	): Promise<string> {
	return JSON.stringify(googleResult)
}

export async function mockVerifyGoogleToken(
		googleToken: string
	): Promise<GoogleResult> {
	return JSON.parse(googleToken)
}
