
import {Rando} from "../../../toolbox/get-rando.js"
import {mockStripeLiaison} from "./mocks/mock-stripe-liaison.js"
import {MakeStripeLiaison} from "./types/make-stripe-liaison.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export function prepareMockStripeLiaison({rando, tableStorage}: {
			rando: Rando,
			tableStorage: FlexStorage
		}): MakeStripeLiaison {

	return function({tables}) {
		return mockStripeLiaison({rando, tables, tableStorage})
	}
}
