import {EmailDetails} from "./email-details"


export type SendEmail = ({}: EmailDetails) => Promise<void>
