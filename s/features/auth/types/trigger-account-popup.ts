
import {AuthTokens} from "./tokens/auth-token.js"

export type TriggerAccountPopup = () => Promise<AuthTokens>
