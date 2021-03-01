import {LoginEmailDetails} from "./LoginEmailDetails"


export type SendLoginEmail = ({}: LoginEmailDetails) => Promise<void>
