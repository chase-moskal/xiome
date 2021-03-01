
import {AuthTokens} from "./auth-token.js"

export type TriggerAccountPopup = () => Promise<AuthTokens>
