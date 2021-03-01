
import {EmailDetails} from "./email-details.js"

export type SendEmail = ({}: EmailDetails) => Promise<void>
