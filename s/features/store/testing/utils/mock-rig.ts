
export interface MockStoreRig {
	stripeAccountFate: "complete" | "incomplete"
	stripeLoginCount: number
	customerPortalAction:
		"link successful payment method" |
		"link failing payment method" |
		"detach payment method"
}

export function mockStoreRig(): MockStoreRig {
	return {
		stripeAccountFate: "complete",
		stripeLoginCount: 0,
		customerPortalAction: "link successful payment method"
	}
}
