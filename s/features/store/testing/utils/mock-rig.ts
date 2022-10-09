
export interface MockStoreRig {
	stripeAccountFate: "complete" | "incomplete"
	stripeLoginCount: number
}

export function mockStoreRig(): MockStoreRig {
	return {
		stripeAccountFate: "complete",
		stripeLoginCount: 0,
	}
}
