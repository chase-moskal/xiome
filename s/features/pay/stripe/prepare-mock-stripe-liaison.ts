
import {Rando} from "../../../toolbox/get-rando.js"
import {mockStripeLiaison} from "./mocks/mock-stripe-liaison.js"
import {MakeStripeLiaison} from "./types/make-stripe-liaison.js"

export function prepareMockStripeLiaison({rando}: {rando: Rando}): MakeStripeLiaison {
	return function({payTables}) {
		return mockStripeLiaison({rando, payTables})
	}
}
