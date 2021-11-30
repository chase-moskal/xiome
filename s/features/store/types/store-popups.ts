
export type TriggerBankPopup = ({stripeAccountId, stripeAccountSetupLink}: {
	stripeAccountId: string
	stripeAccountSetupLink: string
}) => Promise<void>

export type TriggerCheckoutPopup = ({stripeAccountId}: {
	stripeAccountId: string
}) => Promise<void>
