
export type TriggerStripeConnectPopup = ({stripeAccountId, stripeAccountSetupLink}: {
	stripeAccountId: string
	stripeAccountSetupLink: string
}) => Promise<void>

export type TriggerCheckoutPopup = ({stripeSessionUrl}: {
	stripeSessionUrl: string
}) => Promise<void>
