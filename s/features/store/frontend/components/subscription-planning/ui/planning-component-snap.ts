
import {snapstate} from "@chasemoskal/snapstate"

export function makePlanningComponentSnap() {
	return snapstate({
		draftNewPlan: undefined as undefined | {
			loading: boolean
			problems: string[]
		},
		draftNewTier: undefined as undefined | {
			planId: string
			loading: boolean
			problems: string[]
		},
		editingPlanDraft: undefined as undefined | {
			isChanged: boolean
			planId: string
			loading: boolean
			problems: string[]
		},
		editingTierDraft: undefined as undefined | {
			isChanged: boolean
			planId: string
			tierId: string
			loading: boolean
			problems: string[]
		},
	})
}
