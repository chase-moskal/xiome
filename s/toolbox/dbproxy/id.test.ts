
import {expect, Suite} from "cynic"

import {Id} from "./id.js"
import {getRando} from "../get-rando.js"

export default <Suite>{
	"id": async() => {
		const rando = await getRando()
		return {
			"many ids survive encode-decode-encode": async() => {
				for (let i = 0; i < 1000; i++) {
					const id = rando.randomId()
					const id_binary = id.toBinary()
					const id_string = id.toString()
					const id_back_from_binary = new Id(id_binary)
					const id_back_from_string = Id.fromString(id_string)
					expect(id_string).equals(id_back_from_binary.toString())
					expect(id_string).equals(id_back_from_string.toString())
				}
			},
		}
	},
}
