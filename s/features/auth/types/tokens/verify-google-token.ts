
import {GoogleResult} from "./google-result.js"

export type VerifyGoogleToken = (googleToken: string) => Promise<GoogleResult>
