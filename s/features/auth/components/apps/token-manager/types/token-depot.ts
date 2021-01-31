
import {TokenState} from "./token-state.js"

export interface TokenDepot {
	state: TokenState
	handleFormChange: () => void
	handleSubmitClick: () => void
}
