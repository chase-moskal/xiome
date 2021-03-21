
import {StripeWebhookError} from "./stripe-webhook-error.js"

export const err = (message: string) => new StripeWebhookError(message)
