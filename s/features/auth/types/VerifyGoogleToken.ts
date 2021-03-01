import {GoogleResult} from "./GoogleResult.js"


export type VerifyGoogleToken = (googleToken: string) => Promise<GoogleResult>
