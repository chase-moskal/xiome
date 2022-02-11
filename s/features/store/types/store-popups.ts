
export type TriggerStripeConnectPopup = ({stripeAccountId, stripeAccountSetupLink}: {
	stripeAccountId: string
	stripeAccountSetupLink: string
}) => Promise<void>

export type TriggerCheckoutPopup = ({stripeSessionId, stripeSessionUrl}: {
	stripeSessionId: string
	stripeSessionUrl: string
}) => Promise<void>
