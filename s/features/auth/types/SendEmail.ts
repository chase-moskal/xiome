import {EmailDetails} from "./EmailDetails"


export type SendEmail = ({}: EmailDetails) => Promise<void>
