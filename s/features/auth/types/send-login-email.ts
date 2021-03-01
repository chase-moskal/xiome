import {LoginEmailDetails} from "./login-email-details"


export type SendLoginEmail = ({}: LoginEmailDetails) => Promise<void>
