
export type TriggerBankPopup = ({stripeAccountId, stripeAccountSetupLink}: {
	stripeAccountId: string
	stripeAccountSetupLink: string
}) => Promise<void>

export type SubscriptionCheckoutPopup = () => Promise<void>
