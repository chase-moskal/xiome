
export type TriggerStripeConnectPopup = ({stripeAccountId, stripeAccountSetupLink}: {
	stripeAccountId: string
	stripeAccountSetupLink: string
}) => Promise<void>

export type TriggerStripeLogin = ({url, stripeAccountId}: {
	url: string
	stripeAccountId: string
}) => Promise<void>

export type TriggerCheckoutPopup = ({stripeAccountId, stripeSessionId, stripeSessionUrl}: {
	stripeAccountId: string
	stripeSessionId: string
	stripeSessionUrl: string
}) => Promise<void>
