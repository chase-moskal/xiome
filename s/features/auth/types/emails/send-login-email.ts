
import {LoginEmailDetails} from "./login-email-details.js"

export type SendLoginEmail = ({}: LoginEmailDetails) => Promise<void>
