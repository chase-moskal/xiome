import {AuthTokens} from "./auth-token"


export type TriggerAccountPopup = () => Promise<AuthTokens>
